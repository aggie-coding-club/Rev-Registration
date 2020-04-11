from datetime import datetime
from typing import List
from itertools import product

def get_all_terms() -> List[str]:
    """ Generates all of the terms, from 2013 until now """

    current_year = datetime.now().year
    years = range(2013, current_year + 1)
    semesters = range(1, 4)
    locations = range(1, 4)

    return [f"{year}{semester}{location}"
            for year, semester, location in product(years, semesters, locations)]
