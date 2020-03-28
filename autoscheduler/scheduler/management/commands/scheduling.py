import datetime
from time import time
from django.core.management import base
from scheduler.utils import UnavailableTime
from scheduler.create_schedules import create_schedules

class Command(base.BaseCommand):
    """ Generates schedules for given courses and term """

    def handle(self, *args, **options):
        # Setup data to create schedule from
        courses = [("COMM", "203"), ("CSCE", "121"), ("CSCE", "411"), ("MATH", "151"),
                   ("CSCE", "181")]
        term = "201911"
        unavailable_times = [UnavailableTime(datetime.time(8), datetime.time(8, 50), 2),
                             UnavailableTime(datetime.time(8), datetime.time(8, 50), 3)]
        start = time()
        schedules = create_schedules(courses, term, unavailable_times)
        end = time()
        print(f"Took {end - start} seconds to create schedules")
        print(schedules)
