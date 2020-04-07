import datetime
from time import time
from django.core.management import base
from scheduler.utils import CourseFilter, UnavailableTime
from scheduler.create_schedules import create_schedules

class Command(base.BaseCommand):
    """ Generates schedules for given courses and term """

    def handle(self, *args, **options):
        # Setup data to create schedule from
        course_names = [("COMM", "203"), ("CSCE", "121"), ("CSCE", "411"),
                        ("MATH", "151"), ("CSCE", "181")]
        courses = [CourseFilter(subject, course_num)
                   for subject, course_num in course_names]
        courses[3] = CourseFilter("ACCT", "229", honors=True)
        term = "201911"
        unavailable_times = [UnavailableTime(datetime.time(8), datetime.time(8, 50), 2),
                             UnavailableTime(datetime.time(8), datetime.time(8, 50), 3)]

        start = time()
        schedules = create_schedules(courses, term, unavailable_times)
        end = time()
        print(f"Took {end - start:.4f} seconds to create schedules")
        print(schedules)
