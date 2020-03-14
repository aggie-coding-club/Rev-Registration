import time
import os
import asyncio
import ssl
from typing import List
from pathlib import Path
from collections import defaultdict
import requests
import bs4
from aiohttp import ClientSession

from django.core.exceptions import ObjectDoesNotExist
from django.core.management import base

from scraper.models import Grades, Section
from scraper.management.commands.utils import pdf_parser

ROOT_URL = "http://web-as.tamu.edu/gradereport"
PDF_URL = ROOT_URL + "/PDFREPORTS/{}/grd{}{}.pdf"

PDF_DOWNLOAD_DIR = os.path.dirname("documents/grade_dists") # Folder to save all pdf's

SPRING, SUMMER, FALL = "1", "2", "3"

def _create_documents_folder():
    """ Creates the documents/grade_dists folder if it doesn't exist already """
    Path(PDF_DOWNLOAD_DIR).mkdir(parents=True, exist_ok=True)

def generate_term_with_location(year_semester_term: str, college: str):
    """ Given a term in the format {YEAR}{SEMESTER}, converts it to include the location

        Ex: 20193 (Fall 2019) -> 201931 (Fall 2019 College Station)
    """

    location = "1" # Default, College Station
    if college == "GV": # TAMU Galveston
        location = "2"
    elif college == "QT": # TAMU Qatar
        location = "3"

    return f"{year_semester_term}{location}"

def _get_available_years(soup: bs4.BeautifulSoup) -> List[int]:
    """ Given the web-as.tamu.edu BeautifulSoup page data, returns the years that
        have grade distribution reports
    """

    options = soup.select("#ctl00_plcMain_lstGradYear > option")

    return [int(o["value"]) for o in options]

def _get_colleges(soup: bs4.BeautifulSoup) -> List[str]:
    """ Given the web.as-tamu.edu BeautifulSoup page data, returns the colleges that
        have grade distribution reports.

        These are in the format of two letters, such as "EN" for engineering.
    """

    options = soup.select("#ctl00_plcMain_lstGradCollege > option")

    return [o["value"] for o in options]

def save_pdf(data: bytes, save_path: str, year_semester: str, college: str):
    """ Given the pdf data and the path to save it, attempts to write to the file
        and return the according path for the pdf.

        If the pdf page is empty, None will be returned.

        year_location and college are used for debug output only.

        Used exclusively in download_pdf
    """
    try:
        if len(data) == 1245: # Empty page byte count
            print(f"Empty {year_semester} {college}")
            return None

        if data is None: # Does this ever actually happen
            return None

        with open(save_path, "wb+") as file:
            file.write(data)

            print(f"Downloaded {year_semester}-{college}")
            return save_path

    except OSError as err:
        print("Make sure that the documents/grade_dists folder is made!")
        raise err

async def download_pdf(year_semester: int, college: str, session: ClientSession) -> str:
    """ Downloads a pdf for the given college and year

        Args:
            year_semester: The year & semester term we're download for,
                           i.e. 20191 for 2019 Fall
            college: The college we're download, i.e. EN for engineering
            session: The aiohttp ClientSession we'll use to retrieve the pdf
        Returns:
            The path to the downloaded pdf file
    """
    url = PDF_URL.format(year_semester, year_semester, college)
    filename = url.split("/")[-1]
    path = os.path.join(PDF_DOWNLOAD_DIR, filename)

    # Check if the file exists before attempting to download it
    # Really only useful for testing locally, but may be useful in the future
    if os.path.isfile(path):
        print(f"Using cached {year_semester} {college}")
        return path

    ssl_context = ssl.create_default_context(purpose=ssl.Purpose.CLIENT_AUTH)
    async with session.get(url, ssl_context=ssl_context) as response:
        data = await response.read()

        return save_pdf(data, path, year_semester, college)

def scrape_pdf(grade_dists: List[pdf_parser.GradeData], term: str) -> List[Grades]:
    """ Calls parse_pdf on the given pdf and adds all of the grade distributions
        as models to the GRADES array for later saving

        Args:
            pdf_path: The path to the pdf to parse
            term: The term that the grades in this pdf are for with the location included,
                  such as 201931
        Returns:
            A list of grade models that were scraped
     """

    # The count of how many of each department was scraped, used for debug printing
    # str : int
    counts = defaultdict(int) # Default value of int is 0

    # The grade models to return to be saved later
    scraped_grades = []

    for grade_data in grade_dists:
        dept = grade_data.dept

        try:
            # Throws a ObjectDoesNotExist error upon failure
            section = Section.objects.get(
                subject=dept,
                course_num=grade_data.course_num,
                section_num=grade_data.section_num,
                term_code=int(term)
            )

            # Increment how many grades for this department were scraped
            counts[grade_data.dept] = counts[grade_data.dept] + 1

            # Create the grade model and add it to the list of models to be returned
            grade = Grades(section=section, gpa=grade_data.gpa,
                           **grade_data.letter_grades)

            scraped_grades.append(grade)

        except ObjectDoesNotExist:
            print((f"Section couldn't be found for {term} {grade_data.dept}-"
                   f"{grade_data.course_num} {grade_data.section_num}"))

    if len(counts.items()) == 0:
        print(f"No grades scraped")

    for dept, count in counts.items():
        print(f"{dept}: Scraped {count} grades")
    print() # Add a new line to separate the outputs

    return scraped_grades

async def perform_searches(years: List[int], colleges: List[str]) -> List[Grades]:
    """ Gathers all of the retrieve_pdf tasks for each year/semester/college combination

        Then collects the returned list of grade models and returns them
     """

    loop = asyncio.get_running_loop()

    async def retrieve_pdf(year_semester: str, college: str):
        """ Creates a aiohttp session, downloads the grade report pdf, parses & scrapes it
            and returns the list of scraped grades
        """

        async with ClientSession(loop=loop) as session:
            pdf_path = await download_pdf(year_semester, college, session)

            if pdf_path is not None:
                # Parse the pdf then scrape the returned grade distributions
                print(f"Parsing PDF for {year_semester} {college}")

                grade_dists = pdf_parser.parse_pdf(pdf_path)

                # Convert the year_semester term to include the location
                term = generate_term_with_location(year_semester, college)

                scraped_grades = scrape_pdf(grade_dists, term)

                return scraped_grades

            return None

    semesters = [SPRING, SUMMER, FALL]

    # Gather all of the retrieve functions into an array
    tasks = []
    for year in years:
        for semester in semesters:
            for college in colleges:
                year_semester_term = str(year) + semester
                tasks.append(retrieve_pdf(year_semester_term, college))

    grades = [] # list of Grades models
    for scraped_grades in await asyncio.gather(*tasks, loop=loop):
        if scraped_grades:
            grades.extend(scraped_grades)

    return grades

def fetch_page_data() -> bs4.BeautifulSoup:
    """ Retrieves the ROOT_URL HTML data and converts it to BeautifulSoup
        so we can parse it to get the available years & colleges to scrape grades for
    """

    # TODO Add SSL certification
    response = requests.get(ROOT_URL, verify=False)
    response.raise_for_status()

    soup = bs4.BeautifulSoup(response.text, "lxml")

    return soup

class Command(base.BaseCommand):
    """ Retrieves all of the possible colleges & terms from web.as-tamu.edu
        Then downloads all of the respective PDF's and parses them
    """

    def handle(self, *args, **_):
        start = time.time()

        # Create the documents/grade_dists folder if it doesn't already exist
        _create_documents_folder()

        # Retrieve the page data and get the available colleges & years from it
        page_soup = fetch_page_data()
        years = _get_available_years(page_soup)
        colleges = _get_colleges(page_soup)

        loop = asyncio.get_event_loop()
        scraped_grades = loop.run_until_complete(perform_searches(years, colleges))

        # Save all of the models
        save_start = time.time()
        # ignore_conflicts is only so we can run this multiple times locally
        Grades.objects.bulk_create(scraped_grades, ignore_conflicts=True)
        save_end = time.time()
        elapsed_time = save_end - save_start
        print(f"Saving {len(scraped_grades)} grades took {elapsed_time:.2f} sec")

        end = time.time()
        elapsed_time = end - start
        print(f"Grade scraping took {elapsed_time:.2f} sec")
