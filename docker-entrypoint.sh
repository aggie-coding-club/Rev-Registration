#!/bin/sh
# Note: This file MUST have LF line endings

# While Docker doesn't actually use the postgres-info.json file, it must be filled out
# otherwise, autoscheduler/config/config.py will call sys.exit() and end the tests before they can run
echo "Creating empty postgres-info.json file"
echo "{ \"user\": \"a\", \"password\": \"a\" }" > /app/autoscheduler/config/postgres-info.json

echo "Resetting migrations"
python3 manage.py makemigrations --settings=autoscheduler.settings.docker --empty scraper

echo "Creating migrations"
python3 manage.py makemigrations --settings=autoscheduler.settings.docker scraper

echo "Migrating"
python3 manage.py migrate --settings=autoscheduler.settings.docker scraper

echo "Starting tests"
export DJANGO_SETTINGS_MODULE=autoscheduler.settings.docker
pytest
