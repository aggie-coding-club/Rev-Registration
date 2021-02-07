from datetime import datetime
from typing import List
from itertools import product

def get_all_terms(year: int = -1, now=datetime.now()) -> List[str]:
    """ Generates all of the terms, from 2013 until now

        If a specific year is given, then this will scrape all semesters/locations
        within that year
    """

    current_year = now.year
    years = range(2013, current_year)

    # If the year was given, only scrape for that year
    # If it's the same year as the current year, then wait till the end so we can only
    # scrape the "recent terms"
    if year != -1 and year != current_year: # pylint: disable=consider-using-in
        years = [year]

    semesters = range(1, 4)
    locations = range(1, 4)

    ret = [f"{year}{semester}{location}"
           for year, semester, location in product(years, semesters, locations)]

    # The above gets us past terms in bulk
    # Now we need to decide what of the recent terms we're going to include in this

    date_format = '%m/%d/%Y'
    summer_fall_reg_start = datetime.strptime(f'03/22/{current_year}', date_format)
    spring_reg_start = datetime.strptime(f'10/26/{current_year}', date_format)

    # Required so that we don't scrape any extra terms
    if year == -1 or year == current_year: # pylint: disable=consider-using-in
        semesters = []

        if now < summer_fall_reg_start:
            semesters.append(f"{current_year}1")
        elif summer_fall_reg_start <= now < spring_reg_start:
            semesters.extend([f"{current_year}1", f"{current_year}2", f"{current_year}3"])
        else:
            semesters.extend([f"{current_year}1", f"{current_year}2", f"{current_year}3",
                              f"{current_year + 1}1"])

        ret.extend([f"{year_semester}{location}"
                    for year_semester, location in product(semesters, locations)])

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
