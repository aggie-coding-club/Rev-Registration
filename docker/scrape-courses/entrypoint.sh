#!/bin/sh
export SETTINGS_MODE=schedule
python3 manage.py scrape_courses --recent --settings=autoscheduler.settings.docker
