#!/bin/sh
# Connect to the thing
export SETTINGS_MODE=proxy
#./cloud_sql_proxy -instances=$GCP_INSTANCE_NAME=tcp:3306 &
# Need to dynamically retrieve the current term?
python3 manage.py scrape_courses -t 202031
