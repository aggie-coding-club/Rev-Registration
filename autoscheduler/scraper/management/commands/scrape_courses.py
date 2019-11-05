import asyncio
import time
from typing import List
from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Course, Instructor, Section, Meeting

def parse_section(section):
    " parse_course() must be done first, and pass the data for each section here "

def parse_meeting(meeting):
    " parse_section() must be done first, and pass the data for each meeting here"

def parse_instructor(instructor):
    " parse_course() must be done first, and pass the data for the instructor here "

def parse_course(course):
    " Parse a course and save all of its relevant information to the database "
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
