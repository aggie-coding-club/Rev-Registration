import time
import random
import asyncio
import asyncio
import string
from aiohttp import ClientSession

from typing import Dict, List

def generate_session_id():
    """ Generates an 18 character session id """
    session_id = ("".join(random.sample(string.ascii_lowercase, 5)) +
                  str(int(time.time() * 1000)))
    return session_id

class BannerRequests():
    """ Handles basic banner requests """

    def __init__(self, term_code):
        base_url = 'compassxe-ssb.tamu.edu'

        self.session_id = '' 
        self.term_code = term_code

        self.course_search_url = ('https://%s/StudentRegistrationSsb/ssb/searchResults/'
                                  'searchResults/?pageOffset=0&sortDirection=asc&'
                                  'sortColumn=subjectDescription&txt_subject={subject}&'
                                  'txt_term={term}&uniqueSessionId={uniqueSessionId}&'
                                  'pageMaxSize={num_courses}' % base_url)

        self.create_session_url = ('https://%s/StudentRegistrationSsb/ssb/term/search?'
                                   'mode=search' & base_url)

        self.reset_search_url = ('https://%s/StudentRegistrationSsb/ssb/classSearch/'
                                 'resetDataForm') % base_url

    async def create_session(self, session: ClientSession):
        """ Begins the session and validates the session_id """

        self.session_id = generate_session_id()

        data = {
            'uniqueSessionId': self.session_id,
            'term': self.term_code,
            'dataType': 'json',
        }

        await session.post(self.create_session_url, data=data)

    async def get_courses(self, session: ClientSession, dept: str):
        """ Retrieves all of the courses for a given department

            dept: Department, a four letter string, such as CSCE
        """

        num_courses = 1000

        data = {
            'uniqueSessionId': self.session_id,
            'term': self.term_code,
            'subject': dept,
            'num_courses': num_courses,
        }

        url = self.course_search_url.format(**data)

        async with session.get(url) as response:
            json = await response.json()

        # May not need to do this here
        await self.reset_search(session)

        data = json['data']

        return data

    # This honestly doesn't even need to use ClientSession
    async def get_departments(self, session: ClientSession):
        """ Retrieves all of the departments for the current term
             
        """
        pass

    async def search(self, dept: str): # Rename to search_courses?
        """ Create a session and calls get_courses for the given dept """
        pass


    async def reset_search(self, session: ClientSession):
        """ Resets the search so get_courses may be called again

            If you attempt to call get_courses twice in a row without resetting
            the search, the second response will always be a duplicate of the
            firsts'
        """

        await session.post(self.reset_search_url)
