import time
import os
from concurrent.futures import ProcessPoolExecutor
from typing import List
from pathlib import Path
from collections import defaultdict
from itertools import chain
import requests
import bs4

from django.core.management import base
from scraper.management.commands.utils import pdf_parser
from scraper.management.commands.utils.scraper_utils import slice_every

# Needed since we have to import the specific models in the functions they're used in
# due to multiprocessing
# pylint: disable=import-outside-toplevel

ROOT_URL = "http://web-as.tamu.edu/gradereport"
PDF_URL = ROOT_URL + "/PDFREPORTS/{}/grd{}{}.pdf"

PDF_DOWNLOAD_DIR = os.path.dirname("documents/grade_dists") # Folder to save all pdf's

SPRING, SUMMER, FALL = "1", "2", "3"

def _create_documents_folder():
    """ Creates the documents/grade_dists folder if it doesn't exist already """
    try:
        Path(PDF_DOWNLOAD_DIR).mkdir(parents=True, exist_ok=True)
    except OSError as err:
        print("Error when attempting to make the documents/grade_dists folder!")
        raise err

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
    if len(data) == 1245: # Empty page byte count
        print(f"Empty {year_semester} {college}")
        return None

    if data is None: # Does this ever actually happen
        return None

    with open(save_path, "wb+") as file:
        file.write(data)

        print(f"Downloaded {year_semester}-{college}")
        return save_path

def download_pdf(year_semester: int, college: str) -> str:
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

    max_retries = 10
    for i in range(max_retries):
        try:
            data = requests.get(url).content

            return save_pdf(data, path, year_semester, college)
        except requests.exceptions.ConnectionError:
            print((f"\nCONNECTION ERROR: nRetrying with {year_semester} {college}:"
                   f" Retry {i}\n\n"))

    return None # Retrying failed

def scrape_pdf(grade_dists: List[pdf_parser.GradeData], term: str):
    """ Calls parse_pdf on the given pdf and adds all of the grade distributions
        as models to the GRADES array for later saving

        Args:
            pdf_path: The path to the pdf to parse
            term: The term that the grades in this pdf are for with the location included,
                  such as 201931
        Returns:
            A list of grade models that were scraped
    """

    if not grade_dists:
        return []

    # Setup Django for each worker process
    import django
    django.setup()

    # We can't import the models for this entire file as Django throws "App not setup" err
    from scraper.models import Section, Grades

    # The count of how many of each department was scraped, used for debug printing
    # str : int
    counts = defaultdict(int) # Default value of int is 0

    # Collect attributes into a list so we can bulk query for the Sections
    subjects, course_nums, section_nums = zip(*((data.dept, data.course_num,
                                                 data.section_num)
                                                for data in grade_dists))

    # Retrieve all of the Sections that have grades for them in this PDF
    models = Section.objects.filter(subject__in=subjects, course_num__in=course_nums,
                                    section_num__in=section_nums, term_code=int(term))

    # Use the (subject, course_num, section_num) as the key, since GradeData doesn't have
    # access to the actual section id
    sections_dict = {(section.subject, section.course_num, section.section_num): section
                     for section in models.iterator()}

    def create_grades(grade_dists, sections_dict, counts):
        """ Runs through the grade_dists and yields the resulting Grades objects,
            using the given Sections in the sections_dict for the models
        """

        for grade_data in grade_dists:
            dept = grade_data.dept

            # Increment how many grades for this department were scraped
            counts[dept] += 1

            key = (dept, grade_data.course_num, grade_data.section_num)

            section = sections_dict.get(key)

            if not section:
                print((f"Section couldn't be found for {term} {grade_data.dept}-"
                       f"{grade_data.course_num} {grade_data.section_num}"))
                continue

            yield Grades(section=section, gpa=grade_data.gpa, **grade_data.letter_grades)

    # ProcessPoolExecutor doesn't work with generators, so execute it before returning
    scraped_grades = list(create_grades(grade_dists, sections_dict, counts))

    if not counts:
        print("No grades scraped")

    for dept, count in counts.items():
        print(f"{dept}: Scraped {count} grades")

    return scraped_grades

def retrieve_pdf(year_semester: str, college: str):
    """ Downloads the grade report pdf, parses & scrapes it and returns the list of
        scraped grades

        Returns:
            A list of Grades models
    """

    pdf_path = download_pdf(year_semester, college)

    if pdf_path is not None:
        # Parse the pdf then scrape the returned grade distributions
        print(f"Parsing PDF for {year_semester} {college}")

        grade_dists = pdf_parser.parse_pdf(pdf_path)

        # Convert the year_semester term to include the location
        term = generate_term_with_location(year_semester, college)

        scraped_grades = scrape_pdf(grade_dists, term)

        print(f"Done for {year_semester} {college}\n")
        return scraped_grades

    return None


def perform_searches(years: List[int], colleges: List[str]):
    """ Gathers all of the retrieve_pdf tasks for each year/semester/college combination
        Then collects the returned list of grade models and returns them. Uses a pool of
        N worker processes, with each process running one retrieve_pdf task at a time,
        where N=number of CPU cores (including hyperthreaded/virtual cores)

        Returns:
            A list of Grades models
     """

    semesters = [SPRING, SUMMER, FALL]

    if max_worker_procs == -1:
        # Multiprocessing seems to work best when this is equal to number of CPU cores
        max_worker_procs = os.cpu_count()

    with ProcessPoolExecutor(max_workers=max_worker_procs) as executor:
        results = [executor.submit(retrieve_pdf, f"{year}{semester}", college)
                   for year in years for college in colleges for semester in semesters]

    return list(chain.from_iterable(filter(None, (res.result() for res in results))))

def fetch_page_data() -> bs4.BeautifulSoup:
    """ Retrieves the ROOT_URL HTML data and converts it to BeautifulSoup
        so we can parse it to get the available years & colleges to scrape grades for
    """

    response = requests.get(ROOT_URL, verify=True)
    response.raise_for_status()

    soup = bs4.BeautifulSoup(response.text, "lxml")

    return soup

class Command(base.BaseCommand):
    """ Retrieves all of the possible colleges & terms from web.as-tamu.edu
        Then downloads all of the respective PDF's and parses them
    """

    def add_arguments(self, parser):
        parser.add_argument('--year', '-y', type=int,
                            help="The year you want to scrape grades for, such as 2019")
        parser.add_argument('--college', '-c', type=str,
                            help="The college you want to scrape grades for, such as EN")

    def handle(self, *args, **options):
        start = time.time()

        # Create the documents/grade_dists folder if it doesn't already exist
        _create_documents_folder()

        # Retrieve the page data and get the available colleges & years from it
        page_soup = fetch_page_data()

        years = [options['year']] if options['year'] else _get_available_years(page_soup)
        colleges = ([options['college']] if options['college']
                    else _get_colleges(page_soup))

        scraped_grades = perform_searches(years, colleges)

        # Have to import here due to Django "App not found" error due to multiprocessing
        from scraper.models import Grades

        # Save all of the models
        save_start = time.time()
        # ignore_conflicts is only so we can run this multiple times locally
        for slc in slice_every(scraped_grades, 50_000):
            Grades.objects.bulk_create(slc, ignore_conflicts=True)
        save_end = time.time()
        elapsed_time = save_end - save_start
        print(f"Saving {len(scraped_grades)} grades took {elapsed_time:.2f} sec")

        end = time.time()
        elapsed_time = end - start
        print(f"Grade scraping took {elapsed_time:.2f} sec")
