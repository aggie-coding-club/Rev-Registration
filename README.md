# Rev Registration

[![Backend CI](https://github.com/aggie-coding-club/Automatic-Aggie-Scheduler/workflows/Backend%20CI/badge.svg)](https://github.com/aggie-coding-club/rev-registration/actions?query=branch%3Amaster+workflow%3A%22Backend+CI%22)
[![Frontend CI](https://github.com/aggie-coding-club/Automatic-Aggie-Scheduler/workflows/Frontend%20CI/badge.svg)](https://github.com/aggie-coding-club/rev-registration/actions?query=branch%3Amaster+workflow%3A%22Frontend+CI%22)

> Note: We are not currently accepting contributors at this time

# ![project-demo](./assets/project-demo.gif)

## Description

Rev Registration is an automatic class scheduler for Texas A&M, aimed at easing the process
of course registration by generating compatible schedules given the courses a student would
like to take and what preferences they have. Simply select a term, pick your courses, mark off when
you're not available, and we'll generate schedules for you!

For instance, imagine you've settled on 3 sections of a course you are fine with having and are having
trouble finding a schedule without conflicts. Select all 3 under the Section customization level,
add in your other classes, and let the schedule generator create schedules for you without time conflicts!

**Features:**

- Automatic schedule generation
- Block off busy times (availabilities)
- Displays grade distribution
- Shows current seats remaining
- Search by course number or title
- Filter for only honors or online sections
- Visual display of schedules
- Remembers preferences for easy access during registration
- Login with Google
- Save, rename, and delete generated schedules
- Filter out full sections

## Installation

Follow these steps to start a local Django server using a PostgreSQL database:

0) For Windows, use powershell instead of command prompt.
    - Some commands don't always work on command prompt.
1) If you don’t have it already, download Python from [here](https://www.python.org/downloads/).
2) Clone the current project: `git clone https://github.com/aggie-coding-club/Rev-Registration.git`
    - This will clone the project into the current directory
3) To install the packages, you first need to make a virtual environment for Python, which will help us ensure that our libraries & Python versions are unified. You can do so by running:
    - It is recommended to put the virtual environment in the root directory: `./Rev-Registration`
    - `python3 -m venv env`
        - This creates a virtual environment in the `env/` folder.
        - In here you'll see a directory containing the libraries that will be installed in the next step(`Lib/` on Windows)
        - You'll also see a folder(`Scripts/` on Windows & `bin/` on Unix systems) that contains the scripts that you need to start the virtual environment.
        - Depending on your Python version, you may have to replace the `python3` in all commands with either `python` or `py`. (aliases)
            - Error: `The term 'python3' is not recognized as the name of a cmdlet, function, script file, or operable program.`
    - Next, for Unix systems run: `source env/bin/activate`
    - And for Windows, in Powershell run: `./env/Scripts/activate`
        - If you get a permissions error that says: `execution of scripts is disabled on this system`, then open another PowerShell as Administrator and run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`.
            - Alternatively, you can just run the original script as Administrator.
    - You will need to do `source env/bin/activate` or `./env/Scripts/activate` anytime you want to interact with the server(i.e. to run it with `python manage.py runserver`)
4) Now, run `pip install -r autoscheduler/requirements.txt` to install the necessary packages for the project.
5) Set up a PostgresQL server by following one of these guides, and make sure you set the name of the database when prompted to `dbautoscheduler`:
    - [Windows](http://www.postgresqltutorial.com/install-postgresql/)
    - [Mac](https://github.com/aggie-coding-club/Automatic-Aggie-Scheduler/wiki/Setup-Postgres-PGAdmin-on-MacOs)
    - [Linux](https://www.techrepublic.com/blog/diy-it-guy/diy-a-postgresql-database-server-setup-anyone-can-handle/)
    - You may also want to download pgAdmin 4 for ease of database management (it can be installed alongside PostgreSQL if you used the above Windows guide). It can be downloaded from [here](https://www.pgadmin.org/download/).

6) (Only if using pgAdmin) Create a new server by opening pgAdmin and right-click “Servers->Create->Server…”. Set a name pgAdmin will use (it can be anything), then change to the Connection tab. Ensure the following settings are being used:

```text
Host name/address: localhost
Port: 5432
Maintenance database: postgres
Username: postgres
Password: (not necessary)
```

7) Ensure the database `dbautoscheduler` has been created:
Using psql: Type `\l` in the psql prompt and see if `dbautoscheduler` is in the list.
Using pgAdmin: Click the name of the server you created, and see if `dbautoscheduler` is in the tree menu.

8) Navigate to the frontend directory: `./autoscheduler/frontend/src/` and run `npm install` to install our frontend dependencies
    
9) Before making code changes, please go to the Github project [wiki](https://github.com/aggie-coding-club/Rev-Registration/wiki) and follow the Project Setup and Install section.

## Running

Before running any commands, if you're not running in the virtual environment(you should see `(env)` somewhere in your current terminal line), run `source env/bin/activate` or `./env/Scripts/activate`.

### Backend:
- You will have to make and apply migrations before running the server (and whenever our models are changed). To generate the files that django uses to apply migrations, run `python3 ./manage.py makemigrations`, and to then apply these to the database, run `python3 ./manage.py migrate`.
    - `manage.py` can be found in the `./autoscheduler/` directory.

- After migrating, you can run the server with `python3 ./manage.py runserver`. When running for the first time, you will have to configure `autoscheduler/autoscheduler/config/postgres-info.json` with your postgres username and password. This file will be automatically created if you run `python3 ./manage.py runserver`.
     - This starts a webserver that's listening on port 8000, so you can navigate to `localhost:8000/` and you should see the landing page
          - Note: you must have run `npm run dev` from below

- If `python3 ./manage.py` isn't working, try to use `python manage.py ...` or `py ./manage.py ...` or `./manage.py ...` in place of it.
    - See python aliases above

#### Scraping Course Info:
The first time you run the server, you will need to scrape the course info from TAMU:
Scraping command arguments:
- `python manage.py scrape_depts`.
  - `-t [term]` or `--term [term]`
    - e.g. `scrape_depts -t 202031`
- `python manage.py scrape_courses`
  - `-t [term]` or `--term [term]`
    - e.g. `scrape_courses -t 202031`
  - `-y [year]` or `--year [year]`
    - e.g. `scrape_courses -y 2020`
    - Scrapes all semesters + locations for the given year
  - `-r` or `--recent`
    - e.g. `scrape_courses -r`
      - Scrapes the most recent terms. E.g. if it's October 1st, will scrape Summer + Fall 2020 for all locations
  - `-t`, `-y`, and `-r` are mutually exclusive
- `python manage.py scrape_grades`
  - `-y [year]` or `--year [year]`
    - e.g. `scrape_grades -y 2020`
  - `-c [college]` or `--college [college]`
    - e.g. `scrape_grades -c EN`
  - `-p [procs]` or `--procs [procs]`
    - e.g. `scrape_grades -p 5`
    - `scrape_grades` uses mutli-processing, and this changes how many processes run at a time. Defaults to the number of cores your CPU has.
  - Note that all of `scrape_grades` arguments can be used at the same time

### Frontend:
- Navigate to the frontend source directory: `cd ./autoscheduler/frontend/src` and run `npm run dev`
    - This sets up a watch for file changes and compiles them
    - If you already have `python manage.py runserver` running, you can see the server at `localhost:8000/` and refresh after you change files and `npm run dev` re-compiles them.
    - ctrl-c to quit

#### Testing:

- The frontend has automated test suites which can be run with:
    - `cd ./autoscheduler/frontend/src`
    - `npm run test`
        - Can put filename after to test only one file: `npm run test testfile.test.tsx`
            - It is possible that you will need the relative filepath in front of the `testfile.test.tsx`, while on other systems you can't have it.
    - If that doesn't work try: `npx jest <filename>`
