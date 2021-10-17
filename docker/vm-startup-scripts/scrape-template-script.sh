#!/bin/sh
# This is the general script that runs on startup for automate scrape courses
set -x
git clone https://github.com/aggie-coding-club/Rev-Registration.git
cd Rev-Registration/
git fetch
git reset --hard origin/production

# Make fill_credentials.sh executable
chmod +x fill_credentials.sh
./fill_credentials.sh DB-USERNAME-HERE DB-PASSWORD-HERE

export GCP_DB_NAME=GCP-DB-NAME-HERE

# The -E is "preserve-env", and allows us to use GCP_DB_NAME
# Note: Change SOMETHING to whatever you want to scrape (depts, grades, courses)
sudo -E docker-compose up --build --abort-on-container-exit scrape-SOMETHING
# Prune "dangling" images so we don't run out of space
sudo docker images prune -f
sudo shutdown
