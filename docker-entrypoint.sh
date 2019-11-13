#!/bin/sh
# Note: This file MUST have LF line endings

echo "Creating migrations"
python3 manage.py makemigrations --settings=autoscheduler.settings.docker scraper

echo "Migrating"
python3 manage.py migrate --settings=autoscheduler.settings.docker scraper

echo "Starting tests"
python3 manage.py test --settings=autoscheduler.settings.docker
