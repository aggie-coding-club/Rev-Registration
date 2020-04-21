from datetime import datetime
from typing import List
from itertools import product

def get_all_terms(year: int = -1) -> List[str]:
    """ Generates all of the terms, from 2013 until now

        If a specific year is given, then this will scrape all semesters/locations
        within that year
    """

    current_year = datetime.now().year
    years = range(2013, current_year + 1)

    # If the year was given, only scrape for that year
    if year != -1:
        years = [year]

    semesters = range(1, 4)
    locations = range(1, 4)

    return [f"{year}{semester}{location}"
            for year, semester, location in product(years, semesters, locations)]
