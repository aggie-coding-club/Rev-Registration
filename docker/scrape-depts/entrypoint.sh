#!/bin/sh
export SETTINGS_MODE=schedule
python3 manage.py scrape_depts --recent --discord --settings=autoscheduler.settings.docker
