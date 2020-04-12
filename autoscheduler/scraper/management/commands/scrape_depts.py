# Called to execute the beginning of scaping courses
import time
import datetime
from typing import List

from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Department
from scraper.management.commands.utils.scraper_utils import get_all_terms

def parse_departments(json, term) -> List[Department]:
    """ Takes in a json list of departments and returns a list of Department objects """

    return [Department(id=f"{dept['code']}{term}", code=dept["code"],
                       description=dept["description"], term=term)
            for dept in json]

def scrape_departments(term) -> List[Department]:
    """ Takes term input and collects json object of departments """

    request = BannerRequests()
    json = request.get_departments(term)

    return parse_departments(json, term)

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

        Department.objects.bulk_create(depts, ignore_conflicts=True)

        end = time.time()
        seconds_elapsed = int(end - start)
        time_delta = datetime.timedelta(seconds=seconds_elapsed)
        print(f"Finished scraping {len(depts)} departments in {time_delta}")
