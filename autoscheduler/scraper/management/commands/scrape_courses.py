import asyncio
import time
from typing import List
from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Course, Instructor, Section, Meeting
from scraper.models.course import generate_course_id
from scraper.models.section import generate_meeting_id, generate_meeting_time

def parse_section(courseData,instructor_object):
    #gets values to create object
    section_id = int(courseData['id'])
    section_subject = courseData['subject']
    course_number = courseData['courseNumber']
    section_number = int(courseData['sequenceNumber'])
    section_term_code = courseData['term']
    section_min_credits = courseData['creditHourLow']
    section_max_credits = courseData['creditHourHigh']
    section_max_enrollment = courseData['maximumEnrollment']
    section_current_enrollment = courseData['enrollment']
    section_instructor = instructor_object
    #creates and saves section object
    section_object = Section(id=section_id, subject=section_subject, course_num=course_number, section_num=section_number, term_code=section_term_code, min_credits=section_min_credits, max_credits=section_max_credits, max_enrollment=section_max_enrollment, current_enrollment=section_current_enrollment, instructor=section_instructor)
    section_object.save()
    #calls parse meeting for each meeting time in the section
    meeting_count=0
    for i in courseData['meetingsFaculty']:
        parse_meeting(i,section_object,meeting_count)
        meeting_count+=1

def parse_meeting(meetingsData,section_object,meeting_count):
    #gets values to create object
    meeting_id = generate_meeting_id(str(section_object.section_num), str(meeting_count))
    meeting_crn = meetingsData['meetingTime']['courseReferenceNumber']
    meeting_building = meetingsData['meetingTime']['building']
    #checks which days classes are on and adds them to attend_days
    meeting_class_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    attend_days = [False,False,False,False,False,False,False]
    day_string = 'monday'
    for j in range(0,len(meeting_class_days)):
        day_string = meeting_class_days[j]
        if meetingsData['meetingTime'][day_string] == True:
            attend_days[j] = True
    meeting_start_time = generate_meeting_time(meetingsData['meetingTime']['beginTime'])
    meeting_end_time = generate_meeting_time(meetingsData['meetingTime']['endTime'])
    meeting_class_type = meetingsData['meetingTime']['meetingType']
    meeting_section = section_object
    #creates and saves meeting object
    meeting_object = Meeting(id=meeting_id, crn=meeting_crn, building=meeting_building, meeting_days=attend_days, start_time=meeting_start_time, end_time=meeting_end_time, meeting_type=meeting_class_type, section=meeting_section)
    meeting_object.save()

def parse_instructor(courseData):#should return instructor model
    #gets values to create object
    for i in courseData['faculty']:
        instructor_id = i['displayName']#primary key. name is currently being used
        instructor_email = i['emailAddress']
        instructor_name = i['displayName']
        #creates and saves instructor object
        instructor_object = Instructor(id=instructor_id, email_address=instructor_email, name=instructor_name)
        instructor_object.save()
        return(instructor_object)

def parse_course(courseData):
    course_dept = courseData['subject']
    course_number = courseData['courseNumber']
    course_title = courseData['courseTitle']
    course_term_code = courseData['term']
    course_id = generate_course_id(course_dept, course_number, course_term_code)#primary key
    course_desc = ''#long description-could not find in data
    course_core_curriculum = ''#to be implented later
    course_credit_hours = courseData['creditHourLow']
    #creates and saves course object
    course_object = Course(id=course_id, dept=course_dept, course_num=course_number, title=course_title, description=course_desc, core_curriculum=course_core_curriculum, credit_hours=course_credit_hours, term=course_term_code)
    course_object.save()
    #calls other parse fuctions
    instructor_object = parse_instructor(courseData)
    parse_section(courseData,instructor_object)
    print(f'{courseData}\n')

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
