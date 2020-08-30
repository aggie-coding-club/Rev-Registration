#!/bin/sh
export SETTINGS_MODE=proxy
# Need to dynamically retrieve the current term?
python3 manage.py scrape_courses -t 202031
