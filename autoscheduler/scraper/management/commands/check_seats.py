import smtplib
import ssl
import asyncio
import time
from typing import List
from django.core.management import base
from scraper.banner_requests import BannerRequests

def available_courses(json, crns: List[str]) -> bool:
    """ Returns whether there are seats in the course with given crn """
    available = []
    for section in json:
        this_crn = section['courseReferenceNumber']
        if this_crn in crns:
            max_enrollment = section['maximumEnrollment']
            current_enrollment = section['enrollment']
            print(f"Enrollment for {this_crn}: {current_enrollment}/{max_enrollment}")
            if current_enrollment < max_enrollment:
                available.append(this_crn)
    return available

class Command(base.BaseCommand):
    """ Runs the command lol go away linter error """
    def handle(self, *args, **kwargs): #pylint: disable=too-many-locals, unused-argument
        """ Checks if any provided CRNs are available and emails you when they are """
        sleep_time = 900 # check every 15 minutes
        # enter departments of the classes you want to check
        depts_to_check = ["CSCE"]
        # replace with crns you want to check
        crns_to_check = set(["37729"])
        term_to_check = "202031"

        # setup ssl/email sending
        port = 465
        # enter your email here, emails will be send to and from this address
        email = "YOUR EMAIL"
        # Your email password (don't worry I won't steal it)
        # Only gmail works because I'm lazy
        # Also if you have 2fa enabled you have to make an app password for mail:
        # https://support.google.com/accounts/answer/185833?hl=en
        password = "YOUR PASSWORD"
        context = ssl.create_default_context()

        # email content
        with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
            server.login(email, password)
            while True:
                banner = BannerRequests(term_to_check)
                loop = asyncio.get_event_loop()
                json = loop.run_until_complete(banner.search(depts_to_check))[0]
                for available_crn in available_courses(json, crns_to_check):
                    message = f"Subject: Spots available for CRN {available_crn}"
                    server.sendmail(email, email, message)

                # wait to send more requests
                time.sleep(sleep_time)
