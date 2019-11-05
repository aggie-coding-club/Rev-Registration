from django.core.management import base
from scraper.banner_requests import BannerRequests
from scraper.models import Department


class Command(base.BaseCommand):
    """ Gets all departments from banner and adds them to the database """

    def add_arguments(self, parser):
        parser.add_argument('--term', type=str, required=False, default="201931")

    def handle(self, *args, **options):
        pass
