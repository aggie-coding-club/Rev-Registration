#!/bin/sh
export SETTINGS_MODE=schedule
python3 manage.py scrape_grades --recent --discord --settings=autoscheduler.settings.docker
