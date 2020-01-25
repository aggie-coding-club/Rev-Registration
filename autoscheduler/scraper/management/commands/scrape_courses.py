import asyncio
import time
import datetime
from typing import List
from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Course, Instructor, Section, Meeting, Department
from scraper.models.course import generate_course_id
from scraper.models.section import generate_meeting_id

def convert_meeting_time(string_time: str) -> datetime.time:
    """ Converts a meeting time from a string in format hhmm to datetime.time object.
        ex) 1245 = 12:45am. 1830 = 6:30 pm.
    """

    if string_time == "" or string_time is None:
        return None

    hour = int(string_time[0:2])
    minute = int(string_time[2:4])
    meeting_time = datetime.time(hour, minute)

    return meeting_time

def parse_meeting_days(meetings_data) -> List[bool]:
    """ Generates a list of seven booleans where each corresponds to a day in the week.
        The first is Monday and the last is Sunday. If true, there is class that day
    """
    meeting_class_days = [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    attend_days = [meetings_data['meetingTime'][day] for day in meeting_class_days]

    return attend_days

def parse_section(course_data, instructor: Instructor):
    """ Puts section data in database & calls parse_meeting.
        Called from parse_course.
    """

    section_id = int(course_data['id'])
    subject = course_data['subject']
    course_number = course_data['courseNumber']
    section_number = course_data['sequenceNumber']
    term_code = course_data['term']

    crn = 0
    if len(course_data['meetingsFaculty']) > 0:
        crn = course_data['meetingsFaculty'][0]['courseReferenceNumber']

    min_credits = course_data['creditHourLow']
    max_credits = course_data['creditHourHigh']
    max_enrollment = course_data['maximumEnrollment']
    current_enrollment = course_data['enrollment']

    # Creates and saves section object
    section_model = Section(
        id=section_id, subject=subject, course_num=course_number,
        section_num=section_number, term_code=term_code,
        crn=crn, min_credits=min_credits,
        max_credits=max_credits, max_enrollment=max_enrollment,
        current_enrollment=current_enrollment, instructor=instructor)
    section_model.save()

    # Parse each meeting in this section. i is the counter used to identify each Meeting
    for i, meetings_data in enumerate(course_data['meetingsFaculty']):
        parse_meeting(meetings_data, section_model, i)

def parse_meeting(meetings_data, section: Section, meeting_count: int):
    """ Parses the meeting data and saves it as a Meeting model.
        Called by parse_section on each of the section's meeting times.
    """

    meeting_id = generate_meeting_id(str(section.id), str(meeting_count))

    class_days = parse_meeting_days(meetings_data)

    start_time = convert_meeting_time(meetings_data['meetingTime']['beginTime'])
    end_time = convert_meeting_time(meetings_data['meetingTime']['endTime'])

    building = meetings_data['meetingTime']['building']
    class_type = meetings_data['meetingTime']['meetingType']

    meeting_model = Meeting(id=meeting_id, building=building, meeting_days=class_days,
                            start_time=start_time, end_time=end_time,
                            meeting_type=class_type, section=section)
    meeting_model.save()

def parse_instructor(course_data):
    """ Parses the instructor data and saves it as a Instructor model.
        Called from parse_course.
    """

    # Can have multiple instructor entries, although most will have 0-1
    for faculty_data in course_data['faculty']:
        # We only care about the primary instructor, so skip all of the other ones
        if not faculty_data['primaryIndicator']:
            continue

        name = faculty_data['displayName'] if faculty_data['displayName'] else None

        if name is None:
            return None

        email = faculty_data['emailAddress']

        instructor_model = Instructor(id=name, email_address=email)
        instructor_model.save()

        return instructor_model

def parse_course(course_data):
    """ Creates Course model and saves it to the databsae.
        Calls parse_instructor and parse_section
    """

    dept = course_data['subject']
    course_number = course_data['courseNumber']
    term_code = course_data['term']

    # Generate the course's id using the above data
    course_id = generate_course_id(dept, course_number, term_code)

    title = course_data['courseTitle']
    credit_hours = course_data['creditHourLow']

    #creates and saves course object
    course_model = Course(id=course_id, dept=dept, course_num=course_number,
                          title=title, credit_hours=credit_hours, term=term_code)
    course_model.save()

    # Parse the instructor, then send the returned Instructor model to parse_section
    instructor_model = parse_instructor(course_data)
    parse_section(course_data, instructor_model)

def get_department_names(term_code: str) -> List[str]:
    """ Queries database for list of all departments """
    return [dept.code for dept in Department.objects.filter(term=term_code)]

class Command(base.BaseCommand):
    """ Gets course information from banner and adds it to the database """

    def add_arguments(self, parser):
        parser.add_argument('--term', type=str, required=False, default="201931")

    def handle(self, *args, **options):
        banner = BannerRequests(options['term'])
        loop = asyncio.get_event_loop()

        depts = get_department_names(options['term'])

        json = loop.run_until_complete(banner.search(depts))

        start = time.time()
        for course_list in json:
            for course in course_list:
                parse_course(course)

        finish = time.time()
        elapsed_time = finish - start
        print(f'Finished scraping in {elapsed_time:.2f} seconds')
