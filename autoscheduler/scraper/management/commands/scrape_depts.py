# Called to execute the beginning of scaping courses

from django.core.management import base
from scraper.models import Department

import requests
import json
import time
import datetime

BASE_URL = 'https://compassxe-ssb.tamu.edu/StudentRegistrationSsb/ssb/classSearch/get_subject'
BASE_URL_PARAMS = 'https://compassxe-ssb.tamu.edu/StudentRegistrationSsb/ssb/classSearch/get_subject?dataType=json&term=201931&offset=1&max=500'

def get_departments():
    """
    Retrieves all of the departments from BASE_URL and returns them as JSON, if it was successful
    """

    term = '201931' # Get current term from somewhered
    maxCount = 300

    # Call getsubjects
    params = {
        'dataType': 'json',
        'term': term,
        'offset': 1,
        'max': maxCount
    }

    r = requests.get(BASE_URL, params=params)

    json = ''
    # Attempt to convert it to JSON
    try:
        json = r.json()
    except:
        print('Error converting depts to JSON')

    return json

def parse_departments(json):
    """
    Given the JSON of all of the departments, parses them and initializes them into Department objects
    """

    i = 0
    for dept in json:
        # Should have (code, decription)
        dept = Department(code=dept["code"], description=dept["description"])
        dept.save()
        i = i + 1
    
    print(f"Filled {i} departments")

    return


def scrape_departments():
    json = get_departments()

    parse_departments(json)

class Command(base.BaseCommand):
    def handle(self, *args, **options):
        # Do stuff
        start = time.time()
        scrape_departments()
        end = time.time()
        seconds_elapsed = int(end - start)
        time_delta = datetime.timedelta(seconds=seconds_elapsed)
        print(f"Finished scraping departments in {time_delta}")