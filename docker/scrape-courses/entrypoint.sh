#!/bin/sh
export SETTINGS_MODE=schedule
# Need to dynamically retrieve the current term?
python3 manage.py scrape_courses --recent --settings=autoscheduler.settings.docker
