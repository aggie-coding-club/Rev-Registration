from itertools import islice, groupby
from typing import Dict, Iterable, List, Tuple
from django.db.models import QuerySet
from scraper.models import Meeting, Section
from scheduler.utils import random_product, CourseFilter, UnavailableTime, BasicFilter

class NoSchedulesError(Exception):
    """ Custom exception class that will be raised if no schedules are possible
        with the given arguments
    """

# Possible error messages for NoSchedulesError
_BASIC_FILTERS_TOO_RESTRICTIVE = (
    '{subject} {course_num}: No sections match all of the basic filters you selected.'
)
_NO_SECTIONS_WITH_SEATS = (
    '{subject} {course_num}: None of the sections you selected have available seats.'
)
_NO_SECTIONS_MATCH_AVAILABILITIES = (
    '{subject} {course_num}: None of the sections you selected are compatible with your '
    'available times. Either select more sections, or remove some of your busy times.'
)
_NO_COURSES = (
    'You must add at least one course to generate schedules.'
)
_NO_SCHEDULES_POSSIBLE = (
    'No schedules possible. '
    'Either select more sections or remove some of your busy times.'
)

def _apply_basic_filters(sections: QuerySet, course: CourseFilter):
    """ Applies basic filters from a CourseFilter to a section QuerySet """
    # Handle honors filter
    if course.honors is not BasicFilter.NO_PREFERENCE:
        if course.honors is BasicFilter.EXCLUDE:
            sections = sections.filter(honors=False)
        elif course.honors is BasicFilter.ONLY:
            sections = sections.filter(honors=True)
        if not sections:
            raise NoSchedulesError(_BASIC_FILTERS_TOO_RESTRICTIVE.format(
                subject=course.subject,
                course_num=course.course_num
            ))

    # Handle remote filter
    if course.remote is not BasicFilter.NO_PREFERENCE:
        if course.remote is BasicFilter.EXCLUDE:
            # F2F with remote option should be included regardless of web attribute,
            # but F2F with remote option has web=True
            sections = (sections.filter(remote=False)
                        | sections.filter(instructional_method=Section.F2F_REMOTE_OPTION))
        elif course.remote is BasicFilter.ONLY:
            sections = sections.filter(remote=True)
        if not sections:
            raise NoSchedulesError(_BASIC_FILTERS_TOO_RESTRICTIVE.format(
                subject=course.subject,
                course_num=course.course_num
            ))

    # Handle async filter
    if course.asynchronous is not BasicFilter.NO_PREFERENCE:
        if course.asynchronous is BasicFilter.EXCLUDE:
            sections = sections.filter(asynchronous=False)
        elif course.asynchronous is BasicFilter.ONLY:
            sections = sections.filter(asynchronous=True)
        if not sections:
            raise NoSchedulesError(_BASIC_FILTERS_TOO_RESTRICTIVE.format(
                subject=course.subject,
                course_num=course.course_num
            ))

    return sections

def _get_meetings(course: CourseFilter, term: str, include_full: bool,
                  unavailable_times: List[UnavailableTime]) -> Dict[str, Tuple[Meeting]]:
    """ Gets all sections and meetings for each course in courses, and organizes them
        by section_num

    Args:
        course: Tuple of (subject, course_num) to find sections for
        term: Term to find sections for
        include_full: Whether or not to include classes with no seats in schedules
        unavailable_times: Times that the user doesn't want to be in any courses

    Returns:
        A dict of sections for the course with the section number as the key
        and attributes for each meeting in the section as the value
    """
    # Create list of section_nums matching desired course
    sections = Section.objects.filter(course_num=course.course_num,
                                      subject=course.subject, term_code=term)

    # Note: filters should never result in no sections being available if called from
    # the frontend, since they're only selectable if some sections match the constraint

    # Handle section num filter
    if course.section_nums:
        sections = sections.filter(section_num__in=course.section_nums)

    sections = _apply_basic_filters(sections, course)

    # Get id for each valid section to filter and order meeting data
    # Also removes full sections if include_full is False
    sections = sections.values('id', 'current_enrollment', 'max_enrollment')
    # If manually selected don't check if section is full before adding
    if course.section_nums or include_full:
        section_ids = set(section['id'] for section in sections)
    else:
        section_ids = set(section['id'] for section in sections
                          if section['current_enrollment'] < section['max_enrollment'])
    if not section_ids:
        raise NoSchedulesError(
            _NO_SECTIONS_WITH_SEATS.format(subject=course.subject,
                                           course_num=course.course_num)
        )

    # Get meetings based on sections of the course and order them by end time
    meetings = (Meeting.objects.filter(section_id__in=section_ids)
                # Must be ordered by section id or groupby() doesn't work
                .order_by('section_id')
                .only('start_time', 'end_time', 'section_id', 'meeting_days'))

    # Convert meeting_days into a set to check meeting days efficiently
    for meeting in meetings:
        meeting.meeting_days = set(i for i, day in enumerate(meeting.meeting_days) if day)

    # Organize meetings by section number
    meetings = {section_id: tuple(meetings)
                for section_id, meetings in groupby(meetings, key=lambda m: m.section_id)}

    # Filter sections incompatible with unavailable_times by trying to create a "schedule"
    # containing the section and unavailable times
    compatibility = ({"unavailable": unavailable_times}, meetings)
    for section in tuple(meetings):
        if not _schedule_valid(compatibility, ("unavailable", section)):
            del meetings[section]

    if not meetings:
        raise NoSchedulesError(
            _NO_SECTIONS_MATCH_AVAILABILITIES.format(subject=course.subject,
                                                     course_num=course.course_num)
        )
    return meetings

def _partial_schedule_valid(meetings: Tuple[Dict[str, Iterable[Meeting]]],
                            schedule: Tuple[str], added_i: int) -> bool:
    """ Returns whether or not a schedule containing the chosen sections is valid
        after adding the course at index added_i

    Args:
        meetings: Dict mapping courses to section numbers to meetings
        schedule: Sections to check
        addded_i: index of class added to schedule, used to avoid checking all meetings
                  against eachother

    Returns:
        Whether the schedule is valid up to index added_i
    """
    added_section = meetings[added_i][schedule[added_i]]
    for i, section in islice(enumerate(schedule), None, added_i):
        checking_section = meetings[i][section]
        for first_meeting in added_section:
            first_start = first_meeting.start_time
            first_end = first_meeting.end_time
            # Don't compare meetings if they don't have valid start/end times
            if first_start is None or first_end is None:
                continue
            for second_meeting in checking_section:
                second_start = second_meeting.start_time
                second_end = second_meeting.end_time
                if second_start is None or second_end is None:
                    continue
                # Don't compare meetings if they don't share a day
                if first_meeting.meeting_days.isdisjoint(second_meeting.meeting_days):
                    continue
                if first_start <= second_end and first_end >= second_start:
                    return False
    return True

def _schedule_valid(meetings: Tuple[Dict[str, Tuple[Meeting]]],
                    schedule: Tuple[str]) -> bool:
    """ Returns whether or not a schedule containing the sections in schedule
        is valid. Sections should be in the same order as courses, and assumed valid

    Args:
        meetings: tuple of dicts mapping section numbers to meetings
        schedule: list of section numbers to check for compatibility

    Returns:
        Whether or not a schedule containing the given sections is valid
    """
    for i in range(1, len(schedule)):
        if not _partial_schedule_valid(meetings, schedule, i):
            return False
    return True

def create_schedules(courses: List[CourseFilter], term: str,
                     unavailable_times: List[UnavailableTime],
                     include_full: bool,
                     num_schedules: int = 10) -> List[Tuple[int]]:
    """ Generates and returns a schedule containing the courses provided as an argument.

    Args:
        courses: A list of (subject, course num) tuples to create schedules for
        term: Term code to create a schedule for
        unavailable_times: List of times the user doesn't want any classes
        include_full: Whether or not to include classes with no seats in schedules
        num_schedules: Max number of schedules to generate, will always try to make
                       at least 1

    Returns:
        List of tuples each containing section ids of a valid schedule.
        These can be used by our API to efficiently query sections.
    """
    if not courses:
        raise NoSchedulesError(_NO_COURSES)
    # meetings: Tuple of dicts mapping sections to meetings for each course
    meetings = tuple(_get_meetings(course, term, include_full, unavailable_times)
                     for course in courses)
    # Get valid section ids for each course
    valid_choices = tuple(tuple(section_ids) for section_ids in meetings)

    schedules = []
    # Generate random arrangements of sections and create schedules
    for schedule in random_product(*valid_choices):
        if _schedule_valid(meetings, schedule):
            schedules.append(schedule)
            if len(schedules) >= num_schedules:
                break

    if not schedules:
        raise NoSchedulesError(_NO_SCHEDULES_POSSIBLE)
    return schedules
