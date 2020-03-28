from itertools import islice, groupby
from typing import Dict, Iterable, List, Tuple
from scraper.models import Meeting, Section
from scheduler.utils import random_product, UnavailableTime

def _get_sections(course: Tuple[str, str], term: str,
                  unavailable_times: List[UnavailableTime]) -> Dict[str, Tuple[Meeting]]:
    """ Gets all sections and meetings for each course in courses, and organizes them
        by section_num

    Args:
        course: Tuple of (subject, course_num) to find sections for
        term: Term to find sections for

    Returns:
        A dict of sections for the course with the section number as the key
        and attributes for each meeting in the section as the value
    """
    subject, course_num = course

    # Create list of section_nums matching desired course
    sections = (Section.objects.filter(course_num=course_num, subject=subject,
                                       term_code=term)
                .values('id', 'section_num'))
    # Dictionary for translating meeting ids into section numbers
    section_nums = {section['id']: section['section_num'] for section in sections}

    section_ids = [section['id'] for section in sections]
    # Get meetings based on sections of the course and order them by end time
    meetings = (Meeting.objects.filter(section_id__in=section_ids)
                # Must be ordered by section id or groupby() doesn't work
                .order_by('section_id')
                .only('start_time', 'end_time', 'section_id', 'meeting_days'))

    # Convert meeting_days into a set to check meeting days efficiently
    for meeting in meetings:
        meeting.meeting_days = set(i for i, day in enumerate(meeting.meeting_days) if day)

    # Organize meetings by section number
    meetings = {section_nums[section_id]: tuple(meetings)
                for section_id, meetings in groupby(meetings, key=lambda m: m.section_id)}

    # Filter sections incompatible with unavailable_times by trying to create a "schedule"
    # containing the section and unavailable times
    compatibility = ({"unavailable": unavailable_times}, meetings)
    to_delete = tuple(section for section in meetings
                      if not _schedule_valid(compatibility, ("unavailable", section)))
    for section in to_delete:
        del meetings[section]

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
            if first_start is None or first_end is None:
                continue
            for second_meeting in checking_section:
                second_start = second_meeting.start_time
                second_end = second_meeting.end_time
                # No intersection if meeting days don't overlap
                if second_start is None or second_end is None:
                    continue
                if not any(day in second_meeting.meeting_days
                           for day in first_meeting.meeting_days):
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

def create_schedules(courses: List[Tuple[str, str]], term: str,
                     unavailable_times: List[UnavailableTime], num_schedules: int = 10):
    """ Generates and returns a schedule containing the courses provided as an argument.

    Args:
        courses: A list containing the names of courses to include in the schedule.
                 First item in tuple is the subject, second is course_num
        term: Term code to create a schedule for

    Returns:
        Nothing, in the future this may return the section objects for generated schedules
    """
    # meetings: Tuple mapping sections to meetings for each course
    meetings = tuple(_get_sections(course, term, unavailable_times) for course in courses)
    # Get valid section numbers for each course
    valid_choices = tuple(tuple(meetings[i]) for i in range(len(courses)))

    schedules = []
    # Generate random arrangements of sections and create schedules
    for schedule in random_product(*valid_choices):
        if _schedule_valid(meetings, schedule):
            schedules.append(schedule)
            if len(schedules) >= num_schedules:
                break

    return schedules
