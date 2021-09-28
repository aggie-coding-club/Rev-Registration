import os
import time
import datetime
from typing import List

from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Department
from scraper.management.commands.utils.scraper_utils import (
    get_all_terms, get_recent_terms,
)
from discord_bot import send_discord_message

DISCORD_CHANNEL_ID = int(os.getenv('DISCORD_SCRAPE_CHANNEL_ID') or -1)

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
        parser.add_argument('--discord', '-d', action='store_true',
                            help=("Determines whether we send a Discord message to our "
                                  "server on sucess/failure."))
        group = parser.add_mutually_exclusive_group()
        group.add_argument('--term', '-t', type=str,
                            help="A valid term code, such as 201931.")
        group.add_argument('--recent', '-r', action='store_true',
                            help="Scrapes the most recent semester(s) for all locations")

    def handle(self, *args, **options):
        start = time.time()
        depts = []

        if options['term']:
            depts = scrape_departments(options['term'])
        else:
            terms = get_all_terms()
            if options['recent']:
                terms = get_recent_terms()

            for term in terms:
                print(f"Scraping depts for {term}")
                depts.extend(scrape_departments(term))

        Department.objects.bulk_create(depts, ignore_conflicts=True)

        end = time.time()
        elapsed_time = end - start
        print(f"Finished scraping {len(depts)} departments in {elapsed_time:.2f} sec.")

        if options['discord']:
            message = (f"Scrape depts: Succeeded scraping {len(depts)} depts "
                       f"in {elapsed_time:.2f} sec.")

            if len(depts) == 0:
                message = "Scrape depts: Failed."

            send_discord_message(DISCORD_CHANNEL_ID, message)
