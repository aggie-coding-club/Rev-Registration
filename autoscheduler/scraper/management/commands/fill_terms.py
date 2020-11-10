from django.utils import timezone
from django.core.management import base
from scraper.models import Term
from scraper.management.commands.utils.scraper_utils import get_all_terms

class Command(base.BaseCommand):
    """ Small command for filling in the terms that haven't been scraped yet.
        Just a helper, so we don't have to scrape all of the courses just to fill out the
        terms on the remote DB when the Term migration is applied.
        Should only need to be used once during this transition, and never again. If
        you're setting up a new environment, you won't need to run this.
    """
    def handle(self, *args, **options):
        # Can't use datetime.now(), otherwise django will say: "DateTimeField received a
        # naive time zone while time zone support is active."
        last_updated = timezone.now()

        term_models = [
            Term(code=term, last_updated=last_updated)
            for term in get_all_terms()
        ]

        # We're not doing a bulk upsert(delete, then bulk_create) because we don't want to
        # delete old terms - we just want to fill in terms that haven't been scraped yet
        Term.objects.bulk_create(term_models, ignore_conflicts=True)

        print(f'Saved {len(term_models)} terms')
