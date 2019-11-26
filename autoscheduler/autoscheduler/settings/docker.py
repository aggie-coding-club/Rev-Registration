""" The Django settings that Docker uses for continous-integration
    This is needed as we need to create the database from scratch
"""

# Says the imports are unused, but they actually since they're just constants for Django
# pylint: disable=unused-wildcard-import

# Normally not supposed to use wildcard-imports, but it's needed in this case
# pylint: disable=wildcard-import
from autoscheduler.settings.base import *

SECRET_KEY = open("/run/secrets/SECRET_DJANGO_KEY").read()

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "dbautoscheduler",
        "USER": open("/run/secrets/SECRET_POSTGRES_USER").read(),
        "PASSWORD": open("/run/secrets/SECRET_POSTGRES_PASS").read(),
        "HOST": "db",
    }
}
