import asyncio
import time
from typing import List
from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Course, Instructor, Section, Meeting
from course import generate_course_id

def parse_section(course):
    #gets values to create object
    section_id = ''
    section_subject = course['subject']
    course_number = course['courseNumber']
    section_number = ''
    section_term_code = course['term']
    
    section_min_credits = course['creditHourLow']
    section_max_credits = course['creditHourHigh']

    section_max_enrollment = course['maximumEnrollment']
    section_current_enrollment = course['enrollment']
    section_instructor = ''
    for i in course['faculty']:
        instructor_name = i['displayName']
        section_instructor += instructor_name + ','

    #creates and saves section object
    s = Section(id=section_id, subject=section_subject, course_num=course_number, section_num=section_number, term_code=section_term_code, min_credits=section_min_credits, max_credits=section_max_credits, max_enrollment=section_max_enrollment, current_enrollment=section_current_enrollment, instructor=section_instructor)
    s.save()

    #calls parse meeting for each meeting time in the section
    for i in course['meetingsFaculty']:
        parse_meeting(i)

def parse_meeting(i):
    #gets values to create object
    meeting_id = ''
    meeting_crn = i['meetingTime']['courseReferenceNumber']

    meeting_building = i['meetingTime']['building']
    #checks which days classes are on and adds them to attend_days
    meeting_class_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    attend_days = []
    for j in meeting_class_days:
        if i['meetingTime'][j] == True:
            attend_days.append(j)
    meeting_start_time = i['meetingTime']['beginTime']
    meeting_end_time = i['meetingTime']['endTime']

    meeting_class_type = i['meetingTime']['meetingType']
    meeting_section = ''

    #creates and saves meeting object
    m = Meeting(id=meeting_id, crn=meeting_crn, building=meeting_building, meeting_days=attend_days, start_time=meeting_start_time, end_time=meeting_end_time, meeting_type=meeting_class_type, section=meeting_section)
    m.save()

def parse_instructor(course):
    #gets values to create object
    for i in course['faculty']:
        instructor_id = '' 
        instructor_email = i['emailAddress']
        instructor_name = i['displayName']
        #creates and saves instructor object
        i = Instructor(id=instructor_id, email_address=instructor_email, name=instructor_name)
        i.save()

def parse_course(course):
    course_dept = course['subject']
    course_number = course['courseNumber']
    course_title = course['courseTitle']
    course_term_code = course['term']
    course_id = generate_course_id(course_dept, course_number, course_term_code)#primary key

    course_desc = ''#long description-could not find in data

    course_prereqs = ''
    course_coreqs = ''
    course_cd = False #to be implented later. cuurrently set as false
    course_icd = False #to be implented later
    course_core_curriculum = ''#to be implented later
    course_credit_hours = course['creditHourLow']

    #creates and saves course object
    c = Course(id=course_id, dept=course_dept, course_num=course_number, title=course_title, description=course_desc, prequisites=course_prereqs, corequisites=course_coreqs, cd=course_cd, icd=course_icd, core_curriculum=course_core_curriculum, credit_hours=course_credit_hours)
    c.save()

    #calls other parse fuctions
    parse_instructor(course)
    parse_section(course)
    print(f'{course}\n')

def get_department_names(banner: BannerRequests) -> List[str]:
    depts = banner.get_departments()
    return [dept["code"] for dept in depts]

class Command(base.BaseCommand):
    " Gets course information from banner and adds it to the database "

    def add_arguments(self, parser):
        parser.add_argument('--term', type=str, required=False, default="201931")

    def handle(self, *args, **options):
        banner = BannerRequests(options['term'])
        loop = asyncio.get_event_loop()
        # the next line should be used in production, but we should only use two or three
        # departments when testing to make the code run way faster
        # once department scraping is done, we can replace get_department_names
        # with just getting each of the departments for the term from our database
        # depts = get_department_names(banner)
        depts = ['CSCE'] # test with one department, change this if you want
        json = loop.run_until_complete(banner.search(depts, 10)) # only get a few courses
        start = time.time()
        for course_list in json:
            for course in course_list:
                parse_course(course)
        finish = time.time()
        elapsed_time = finish - start
        print(f'Finished scraping in {elapsed_time:.2f} seconds')
