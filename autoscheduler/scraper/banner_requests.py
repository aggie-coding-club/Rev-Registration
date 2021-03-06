""" The Banner Requests class, which is what we'll use to retrieve all of the data/courses
    from Banner(aka Compassxe). While department scraping is pretty straightforward,
    course scraping will need to use be concurrent/use async+await in order to minimize
    the runtime of it.

    Course retrieval example:
        term = "201931"
        var banner = BannerRequests(term)

        depts = ["CSCE", "MATH", "CHEM"]

        loop = asyncio.get_event_loop()
        data = loop.run_until_complete(banner.search(depts))

    Department retrieval example:
        term = "201931"
        var banner = BannerRequests(term)

        amount = 100
        depts = banner.get_departments(term, amount) # Amount is optional, defaults to 300
"""

import time
import random
import asyncio
import string
from typing import Dict, List, Tuple, Callable
from enum import Enum
from aiohttp.client_exceptions import ClientConnectorError, ContentTypeError
from aiohttp import ClientSession

import requests

class Semester(Enum):
    """ The semester of a given term """
    SPRING = 1
    SUMMER = 2
    FALL = 3

class Location(Enum):
    """ The location of the university that the term takes place at """
    COLLEGE_STATION = 1
    GALVESTON = 2
    QATAR = 3
    HALF_YEAR_TERM = 4 # Not sure where to put this, may not need to include

def generate_session_id():
    """ Generates an 18 character session id """
    session_id = ("".join(random.sample(string.ascii_lowercase, 5)) +
                  str(int(time.time() * 1000)))
    return session_id

# Can semester be an enum?
def get_term_code(year: str, semester: Semester, location: Location):
    """ Generates a term code given a year and which semester

        year: 4 character string, could/should probs be an integer

        Semester: fall, spring, summer, wintermester?
    """

    if len(year) != 4:
        raise ValueError("Year argument must be 4 characters long")

    return year + str(semester.value) + str(location.value)

class BannerRequests():
    """ Handles basic banner requests """

    def __init__(self):
        base_url = 'compassxe-ssb.tamu.edu'

        self.depts_url = ('https://%s/StudentRegistrationSsb/ssb/classSearch/get_subject?'
                          'dataType=json&offset=1&term={term}&max={max}' % base_url)

        self.course_search_url = ('https://%s/StudentRegistrationSsb/ssb/searchResults/'
                                  'searchResults/?pageOffset=0&sortDirection=asc&'
                                  'sortColumn=subjectDescription&txt_subject={subject}&'
                                  'txt_term={term}&uniqueSessionId={uniqueSessionId}&'
                                  'pageMaxSize={num_courses}' % base_url)

        self.create_session_url = ('https://%s/StudentRegistrationSsb/ssb/term/search?'
                                   'mode=search&dataType=json' % base_url)

        self.reset_search_url = ('https://%s/StudentRegistrationSsb/ssb/classSearch/'
                                 'resetDataForm') % base_url

    async def create_session(self, session: ClientSession, term: str) -> str:
        """ Begins the session and validates the session_id
            Must be called in order to search for courses
        """

        session_id = generate_session_id()

        data = {
            'uniqueSessionId': session_id,
            'term': term,
        }

        await session.post(self.create_session_url, data=data)

        return session

    async def get_courses(self, session: ClientSession, session_id: str, dept: str, # pylint: disable=too-many-arguments
                          term: str, amount: int) -> List[Dict]:
        """ Retrieves all of the courses for a given department

            dept: Department, a four letter string, such as CSCE
            amount: max amount of courses to retrieve
        """

        data = {
            'uniqueSessionId': session_id,
            'term': term,
            'subject': dept,
            'num_courses': amount,
        }

        url = self.course_search_url.format(**data)

        async with session.get(url) as response:
            json = await response.json()

        await self.reset_search(session)

        data = json['data']

        return data

    def get_departments(self, term: str, amount: int = 300) -> List[Dict]:
        """ Retrieves all of the departments for the given term

            Retrieving departments doesn't require an active session(nor session id),
            so no need to call create_session(...)
        """

        data = {
            'term': term,
            'max': amount,
        }

        url = self.depts_url.format(**data)

        response = requests.get(url) # Blocking, stops the thread until retrieves response

        depts = response.json() # Also blocking

        return depts

    async def search(self, depts_terms: List[Tuple[str, str]],
                     sem: asyncio.Semaphore,
                     parse_all_courses: Callable[[list], list],
                     amount: int = 750
                    ) -> List[List[Dict]]:
        """ Concurrently retrieves all of the given departments and returns them as
            a list of course-lists, with each index corresponding to the courses/sections
            for a department.
        """

        loop = asyncio.get_running_loop()

        courses_set = set()
        instructors_set = set()

        async def perform_search(dept: str, term: str):
            async with ClientSession(loop=loop) as session:
                retry_max = 10
                for i in range(1, retry_max + 1):
                    try:
                        # Must limit the number of concurrent requests, otherwise will get
                        # a "too many file descriptors in select()" error from aiohttp
                        async with sem:
                            print(f"Starting {dept} {term}")
                            session_id = await self.create_session(session, term)

                            course_list = await self.get_courses(session, session_id,
                                                                 dept, term, amount)

                        if course_list is None:
                            continue # Error, retry

                        # We only want to limit the requests, not parsing, so call this
                        # outside of the semaphore
                        ret = parse_all_courses(course_list, term, courses_set,
                                                instructors_set)

                        return ret

                    except (ClientConnectorError, ContentTypeError):
                        # Empty lines help it stand out from the rest of the outputs
                        print(f"\n\nNETWORK ERROR: Retrying {dept} {term}: Take {i} \n\n")

        tasks = [perform_search(dept, term) for dept, term  in depts_terms]

        results = []

        # Runs all of the tasks concurrently, stopping in this for loop after each one is
        # completed
        for result in await asyncio.gather(*tasks, loop=loop):
            results.append(result)

        return results

    async def reset_search(self, session: ClientSession):
        """ Resets the search so get_courses may be called again

            If you attempt to call get_courses twice in a row without resetting
            the search, the second response will always be a duplicate of the
            firsts'
        """

        await session.post(self.reset_search_url)
