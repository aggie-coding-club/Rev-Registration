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

    ret = [f"{year}{semester}{location}"
           for year, semester, location in product(years, semesters, locations)]

    # Only add recent terms if the year wasn't provided
    if year == -1:
        ret.extend(get_recent_terms())

    return set(ret)

def get_recent_semesters(now=datetime.now()) -> List[str]:
    """ Calculates and returns which semester(s) we should be scraping for.
        Returns semesters (just year + semester, no location), not terms. e.g. 20201
    """

    year = now.year

    date_format = '%m/%d/%Y'

    summer_fall_reg_start = datetime.strptime(f'03/22/{year}', date_format)
    spring_reg_start = datetime.strptime(f'10/26/{year}', date_format)

    # For the comments, use now.year = 2020
    # Between [01/01/2020, 03/22/2020)
    if now < summer_fall_reg_start:
        return [f"{year}1"]

    # Between [03/22/2020, 10/26/2020]
    if summer_fall_reg_start <= now < spring_reg_start:
        return [f"{year}2", f"{year}3"]

    # Between [10/26/2020, 12/31/2020]
    return [f"{year + 1}1"]

def get_recent_terms(now=datetime.now()) -> List[str]:
    """ Gets all of the most recent semesters + locations and combines them to get the
        most recent terms to scrape.
    """

    recent_semesters = get_recent_semesters(now)

    locations = range(1, 4)

    return [f"{year_semester}{location}"
            for year_semester, location in product(recent_semesters, locations)]
