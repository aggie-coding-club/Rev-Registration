# TODO: next line
"""
Notes: There should be DB keys on meeting.section_id and meeting.start_time (perhaps composite key?) to speed up queries
"""
from itertools import groupby
from pprint import PrettyPrinter
from typing import Dict, List, Tuple
from django.core.management import base
from scraper.models import Course, Meeting, Section

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
    meeting_nums = {section['id']: section['section_num'] for section in sections}
    section_ids = [section['id'] for section in sections]
    # Get meetings based on sections of the course and order them by end time
    meetings = (Meeting.objects.filter(section_id__in=section_ids)
                # Must be ordered by section id or groupby() doesn't work
                # Sorting by start time allows efficient checking of compatibility
                .order_by('section_id', 'start_time')
                .values('start_time', 'end_time', 'section_id', 'meeting_days'))
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
    pp.pprint(sections)

class Command(base.BaseCommand):
    """ Generates schedule """

    def handle(self, *args, **options):
        # Setup data to create schedule from
        courses = [("JAPN", "302"), ("CSCE", "121"), ("CSCE", "411")]
        term = "201911"
        create_schedules(courses, term)
