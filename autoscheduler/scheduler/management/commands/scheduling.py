# TODO: next line
"""
Notes: There should be a DB key on section id to speed up queries
"""
from itertools import chain, islice, groupby
from pprint import PrettyPrinter
from random import choice
from typing import Dict, Iterable, List, Tuple
from django.core.management import base
from scraper.models import Meeting, Section

# TODO: fill in docstrings

def _get_sections(course: Tuple[str, str], term: str) -> Dict[str, List[Dict]]:
    """ Gets all sections for a given course, and organizes them by section_num

    Returns: A dict of sections for the course with the meeting number as the key
             and attributes for each meeting as the value
    """
    subject, course_num = course
    # Create list of section_nums matching desired course
    sections = (Section.objects.filter(course_num=course_num, subject=subject,
                                       term_code=term)
                .values('id', 'section_num'))
    # Dictionary for translating meeting ids into section numbers
    meeting_nums = {section['id']: section['section_num'] for section in sections}
    section_ids = [section['id'] for section in sections]
    # Get meetings based on sections of the course and order them by end time
    meetings = (Meeting.objects.filter(section_id__in=section_ids)
                # Must be ordered by section id or groupby() doesn't work
                .order_by('section_id')
                .values('start_time', 'end_time', 'section_id', 'meeting_days'))
    # Make meeting days into a set to check meeting days efficiently
    for meeting in meetings:
        meeting_days = meeting['meeting_days']
        meeting['meeting_days'] = set(day for day in range(7) if meeting_days[day])

    return {meeting_nums[section_num]: list(meetings)
            for section_num, meetings in groupby(meetings, key=lambda m: m['section_id'])}

def create_schedules(courses: List[Tuple[str, str]], term: str, num_schedules: int = 10):
    """ Generates and returns a schedule containing the courses provided as an argument.

    Args:
        courses: A list containing the names of courses to include in the schedule.
                 First item in tuple is the subject, second is course_num
        term: Term code to create a schedule for

    """
    pp = PrettyPrinter(indent=4)
    sections = {course: _get_sections(course, term) for course in courses}
    # TODO: sort courses by number of sections? perhaps only if there are sufficiently few
    # TODO: always sort by num sections to check compatibility more efficiently
    # TODO: change section keys to indices for faster lookup?
    pp.pprint(sections)
    # Get section numbers for each course
    valid_choices = tuple(tuple(sections[course]) for course in courses)
    print(valid_choices)
    if any(len(num_choices) == 0 for num_choices in valid_choices):
        # One or more classes has no valid sections, so no schedules are possible
        return []

    def valid(choices: Tuple[int], added_i: int) -> bool:
        """ Returns whether or not a schedule containing the chosen sections is valid
            after adding the course at index added_i
        """
        added_section = sections[courses[added_i]][choices[added_i]]
        for i, section in islice(enumerate(choices), None, added_i):
            checking_section = sections[courses[i]][section]
            for first_meeting in added_section:
                first_start = first_meeting['start_time']
                first_end = first_meeting['end_time']
                if first_start is None or first_end is None:
                    continue
                meeting_days = first_meeting['meeting_days']
                for second_meeting in checking_section:
                    second_start = second_meeting['start_time']
                    second_end = second_meeting['end_time']
                    # No intersection if meeting days don't overlap
                    if second_start is None or second_end is None:
                        continue
                    if not any(day in second_meeting['meeting_days']
                               for day in meeting_days):
                        continue
                    if first_start <= second_end and first_end >= second_start:
                        return False
        return True

class Command(base.BaseCommand):
    """ Generates schedule """

    def handle(self, *args, **options):
        # Setup data to create schedule from
        courses = [("JAPN", "302"), ("CSCE", "121"), ("CSCE", "411")]
        term = "201911"
        create_schedules(courses, term)
