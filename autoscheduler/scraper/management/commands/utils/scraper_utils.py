from datetime import datetime
from typing import Iterable, List
from itertools import chain, islice, product

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


def slice_every(iterable: Iterable, n: int) -> Iterable[Iterable]:
    """ Divides an iterable into slices of length n. Make sure you consume each slice
        before trying to evaluate the next.
    Args:
        iterable: Any iterable
        n: Size of each slice
    Yields:
        len(iterable)/n iterators of length n corresponding to all items in the iterable.
    """
    it = iter(iterable)
    for first in it:
        rest = islice(it, n-1)
        yield chain([first], rest)
