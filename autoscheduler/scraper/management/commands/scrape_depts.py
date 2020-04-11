# Called to execute the beginning of scaping courses
import time
import datetime

from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Department

def parse_departments(json, term):
    """ Takes json list of departments and saves them as Department objects """

    for dept in json:
        dept = Department(
            id=dept["code"]+term,
            code=dept["code"],
            description=dept["description"],
            term=term)
        dept.save()

def scrape_departments(term):
    """ Takes term input and collects json object of departments """

    request = BannerRequests(term)
    json = request.get_departments()
    parse_departments(json, term)

class Command(base.BaseCommand):
    """ Gets all departments from banner and adds them to the database """

    def add_arguments(self, parser):
        parser.add_argument('term', type=str, default="201931")

    def handle(self, *args, **options):
        start = time.time()
        depts = []

        if options['term'] == 'all':
            terms = get_all_terms()

            for term in terms:
                depts.extend(scrape_departments(term))
        else:
            depts = scrape_departments(options['term'])

        end = time.time()
        seconds_elapsed = int(end - start)
        time_delta = datetime.timedelta(seconds=seconds_elapsed)
        print(f"Finished scraping departments in {time_delta}")
