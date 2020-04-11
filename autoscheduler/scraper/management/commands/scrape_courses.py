import asyncio
from html import unescape
import time
import datetime
from typing import List, Tuple
from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Course, Instructor, Section, Meeting, Department
from scraper.models.course import generate_course_id
from scraper.models.section import generate_meeting_id
from scraper.management.commands.utils.scraper_utils import get_all_terms

# Set of the courses' ID's
COURSES_SET = set()
def convert_meeting_time(string_time: str) -> datetime.time:
    """ Converts a meeting time from a string in format hhmm to datetime.time object.
        ex) 1245 = 12:45am. 1830 = 6:30 pm.
    """

    if not string_time:
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

    return [meetings_data['meetingTime'][day] for day in meeting_class_days]

def parse_section(course_data, instructor: Instructor) -> Tuple[Section, List[Meeting]]: # pylint: disable=too-many-locals
    """ Puts section data in database & calls parse_meeting.
        Called from parse_course.
    """

    section_id = int(course_data['id'])
    subject = course_data['subject']
    course_number = course_data['courseNumber']
    section_number = course_data['sequenceNumber']
    term_code = course_data['term']

    crn = course_data['courseReferenceNumber']

    min_credits = course_data['creditHourLow']
    max_credits = course_data['creditHourHigh']
    max_enrollment = course_data['maximumEnrollment']
    current_enrollment = course_data['enrollment']
    # Go through section attributes to determine if the class is honors
    honors = False
    for attributes in course_data.get('sectionAttributes', []):
        if attributes['description'] == "Honors":
            honors = True
            break

    web = course_data.get('instructionalMethod', "") == "Web Based"

    # Creates and saves section object
    section_model = Section(
        id=section_id, subject=subject, course_num=course_number,
        section_num=section_number, term_code=term_code, crn=crn, min_credits=min_credits,
        max_credits=max_credits, honors=honors, web=web, max_enrollment=max_enrollment,
        current_enrollment=current_enrollment, instructor=instructor)

    # Parse each meeting in this section. i is the counter used to identify each Meeting
    meetings = [] # Ryan will probably want this to be a tuple
    for i, meetings_data in enumerate(course_data['meetingsFaculty']):
        meetings.append(parse_meeting(meetings_data, section_model, i))

    return (section_model, meetings)

def parse_meeting(meetings_data, section: Section, meeting_count: int) -> Meeting:
    """ Parses the meeting data and saves it as a Meeting model.
        Called by parse_section on each of the section's meeting times.
    """

    meeting_id = generate_meeting_id(str(section.id), str(meeting_count))

    class_days = parse_meeting_days(meetings_data)

    start_time = convert_meeting_time(meetings_data['meetingTime']['beginTime'])
    end_time = convert_meeting_time(meetings_data['meetingTime']['endTime'])

    building = meetings_data['meetingTime']['building']
    if building is not None: # Must be escaped for O&M building
        building = unescape(building)

    class_type = meetings_data['meetingTime']['meetingType']

    meeting_model = Meeting(id=meeting_id, building=building, meeting_days=class_days,
                            start_time=start_time, end_time=end_time,
                            meeting_type=class_type, section=section)
    return meeting_model

INSTRUCTORS_SET = set()
def parse_instructor(course_data) -> Instructor:
    """ Parses the instructor data and saves it as a Instructor model.
        Called from parse_course.
    """

    # Can have multiple instructor entries, although most will have 0-1
    for faculty_data in course_data['faculty']:
        # We only care about the primary instructor, so skip all of the other ones
        if not faculty_data['primaryIndicator']:
            continue

        name = faculty_data.get("displayName")

        if name is None:
            return None

        email = faculty_data['emailAddress']

        instructor_model = Instructor(id=name, email_address=email)

        # Causes an error for some reason?
        if name not in INSTRUCTORS_SET:
            INSTRUCTORS_SET.add(name)
            return instructor_model

    return None

def parse_course(course_data) -> Tuple[Course, Instructor, Tuple[Section, List[Meeting]]]:
    """ Creates Course model and saves it to the databsae.
        Calls parse_instructor and parse_section
    """

    dept = course_data['subject']
    course_number = course_data['courseNumber']
    term_code = course_data['term']

    # Generate the course's id using the above data
    course_id = generate_course_id(dept, course_number, term_code)

    # Some course titles contain escaped characters(ex. &amp;), so unescape them
    title = unescape(course_data['courseTitle'])
    # Some titles also start with "HNR-" if the first sections is honors, remove it
    if title[0:4] == "HNR-":
        title = title[4:]
    credit_hours = course_data['creditHourLow']

    # Parse the instructor, then send the returned Instructor model to parse_section
    instructor_model = parse_instructor(course_data)
    section_data = parse_section(course_data, instructor_model)

    # Save course only if it hasn't already been created
    if course_id not in COURSES_SET:
        course_model = Course(id=course_id, dept=dept, course_num=course_number,
                              title=title, credit_hours=credit_hours, term=term_code)
        return (course_model, instructor_model, section_data)
    else:
        return (None, instructor_model, section_data)

    COURSES_SET.add(course_id)


def get_department_names(term_code: str) -> List[str]:
    """ Queries database for list of all departments """
    return [dept.code for dept in Department.objects.filter(term=term_code)]

class Command(base.BaseCommand):
    """ Gets course information from banner and adds it to the database """

    def add_arguments(self, parser):
        # Might want to add an optional 
        parser.add_argument('term', type=str, help="A valid term code, such as 201931.")

    def handle(self, *args, **options): # pylint: disable=too-many-locals, too-many-statements
        depts_terms = []
        start_all = time.time()

        if options['term'] == 'all':
            terms = get_all_terms()

            for term in terms:
                depts = get_department_names(term)
                zipped = zip(depts, [term for i in range(len(depts))])

                depts_terms.extend(zipped)

        else:
            depts = get_department_names(options['term'])
            terms = [options['term'] for i in range(len(depts))]
            depts_terms = zip(depts, [options['term'] for i in range(len(depts))])

        # This limit is artifical for speed at this point,
        concurrent_limit = 50
        sem = asyncio.Semaphore(concurrent_limit)

        banner = BannerRequests()
        loop = asyncio.get_event_loop()

        start = time.time()
        data_set = loop.run_until_complete(banner.search(depts_terms, sem, parse_course))
        finish = time.time()
        elapsed_time = finish - start

        print(f"Downloaded and scraped {len(data_set)} departments data in"
              f" {elapsed_time:.2f} seconds")

        start_save = time.time()
        courses = []
        instructors = []
        meetings = []
        sections = []
        for x in data_set:
            for data in x:
                if data[0] is not None:
                    courses.append(data[0])
                if data[1] is not None:
                    instructors.append(data[1])
                # if data[2] is not None:
                sections.append(data[2][0])
                meetings.extend(data[2][1])

        start = time.time()
        Instructor.objects.bulk_create(instructors, ignore_conflicts=True)
        finish = time.time()
        print(f"Saved {len(instructors)} instructors in {(finish-start):.2f} seconds")

        start = time.time()
        Section.objects.bulk_create(sections, ignore_conflicts=True)
        finish = time.time()
        print(f"Saved {len(sections)} sections in {(finish-start):.2f} seconds")

        start = time.time()
        Meeting.objects.bulk_create(meetings, ignore_conflicts=True)
        finish = time.time()
        print(f"Saved {len(meetings)} meetings in {(finish-start):.2f} seconds")

        start = time.time()
        Course.objects.bulk_create(courses, ignore_conflicts=True)
        finish = time.time()
        print(f"Saved {len(courses)} courses in {(finish-start):.2f} seconds")

        finish_save = time.time()
        elapsed_time = finish_save - start_save

        print(f"Saved all in {elapsed_time:.2f} seconds")

        finish_all = time.time()
        elapsed_time = finish_all - start_all
        print(f"Finished scraping in {elapsed_time:.2f} seconds")
