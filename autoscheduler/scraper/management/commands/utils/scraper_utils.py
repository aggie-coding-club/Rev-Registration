from datetime import datetime
from typing import List, Tuple
from itertools import product

def get_all_terms(*_, year: int = None, now=datetime.now()) -> List[str]:
    """ Generates all of the terms, from 2013 until now

        If a specific year is given, then this will scrape all semesters/locations
        within that year
    """

    current_year = now.year

    years = [year] if year else range(2013, current_year + 1)

    semesters = range(1, 4)
    locations = range(1, 4)

    return set(f"{year}{semester}{location}"
               for year, semester, location in product(years, semesters, locations))

def get_recent_semesters(now=datetime.now()) -> List[str]:
    """ Calculates and returns which semester(s) we should be scraping for.
        Returns semesters (just year + semester, no location), not terms. e.g. 20201
    """

    year = now.year

    date_format = '%m/%d/%Y'

    summer_fall_reg_start = datetime.strptime(f'03/22/{year}', date_format)
    spring_reg_start = datetime.strptime(f'10/16/{year}', date_format)

    # For the comments, use now.year = 2020
    # Between [01/01/2020, 03/22/2020)
    if now < summer_fall_reg_start:
        return [f"{year}1"]

    # Between [03/22/2020, 10/16/2020]
    if summer_fall_reg_start <= now < spring_reg_start:
        return [f"{year}2", f"{year}3"]

    # Between [10/16/2020, 12/31/2020]
    return [f"{year + 1}1"]

def get_recent_terms(now=datetime.now()) -> List[Tuple[str, str]]:
    """ Gets all of the most recent semesters + locations and combines them to get the
        most recent terms to scrape.
    """

    recent_semesters = get_recent_semesters(now)

    locations = range(1, 4)

    return [f"{year_semester}{location}"
            for year_semester, location in product(recent_semesters, locations)]

SPRING, SUMMER, FALL = "1", "2", "3"

def get_recent_grades_semester(now=datetime.now()) -> Tuple[str, str]:
    """ Calculates and returns which year+semester we should scrape for grades.
        Returns a (year, semester) pair.
    """

    year = now.year
    date_format = '%m/%d/%Y'

    fall_date = datetime.strptime(f'02/01/{year}', date_format) # Releases ~late Decemeber
    spring_date = datetime.strptime(f'06/01/{year}', date_format) # Releases ~late May
    summer_date = datetime.strptime(f'10/01/{year}', date_format) # Releases ~mid August

    # For the comments, use now.year = 2020
    # Between [01/01/2020, 02/01/2020)
    if now < fall_date:
        # If we're before the fall date, then we should be scraping the summer
        return (year - 1, SUMMER) # Summer for the year before

    # Between [02/01/2020, 06/01/2020)
    if fall_date <= now < spring_date:
        return (year - 1, FALL) # Fall for the year before

    # Between [06/01/2020, 10/01/2020)
    if spring_date <= now < summer_date:
        return (year, SPRING)

    # Between [10/01/2020, 01/01/2021)
    if summer_date <= now:
        return (year, SUMMER)
