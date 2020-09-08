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

def determine_semesters_to_scrape(now=datetime.now()) -> List[str]:
    """ Calculates and returns which semester(s) we should be scraping for.
        Returns semesters (just year + semester), not terms
    """

    year = now.year

    date_format = '%m/%d/%Y'

    summer_fall_reg_start = datetime.strptime(f'04/01/{year}', date_format)
    spring_reg_start = datetime.strptime(f'11/05/{year}', date_format)

    # We're between [1/1/2020, pre-registration for summer/fall in the spring)
    if now < summer_fall_reg_start:
        return [f"{year}1"]

    # Between [04/01/2020, 11/05/2020]
    if summer_fall_reg_start <= now < spring_reg_start:
        # Summer and Fall for the current year
        return [f"{year}2", f"{year}{3}"]

    # Between [11/05/2020, 04/01/2021]
    return [f"{year + 1}1"]

def determine_terms_to_scrape(now=datetime.now()) -> List[str]:
    """ Gets the most recent semesters and makes the product for the terms """

    recent_semesters = determine_semesters_to_scrape(now)

    locations = range(1, 4)

    return [f"{year_semester}{location}"
            for year_semester, location in product(recent_semesters, locations)]
