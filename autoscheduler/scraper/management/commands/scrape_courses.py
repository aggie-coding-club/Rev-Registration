from django.core.management import base

class Command(base.BaseCommand):
    "Iterates through all of the courses and loads them into the database"
    def handle(self, *args, **kwargs):
        pass