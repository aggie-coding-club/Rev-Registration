from datetime import time
from functools import reduce
from operator import mul
import random
from typing import Any, Iterable, List, NamedTuple, Tuple
import enum

def random_product(*iterables: Iterable[Iterable], limit=100_000) -> Tuple[Any]:
    """ Generates up to limit (or all possible) random unique cartesian products of
        *iterables. Iterables must be indexable, otherwise it is impossible to
        efficiently create products.

    Args:
        iterables: Iterable containing other iterables to make products of
        limit: Max number of schedules to generate

    Yields:
        Iterator of tuples containing the random products
    """
    lengths = tuple(len(iterable) for iterable in iterables)
    # Get number of possible products in order to generate random ones
    num_products = reduce(mul, (length for length in lengths)) if iterables else 0
    if num_products == 0:
        # One or more iterables is empty, stop early to prevent sample from failing
        yield from ()
        return

    # Randomly sample from possible products
    products = random.sample(range(num_products), min(num_products, limit))
    # Numbers to divide product by in order to find correct item in each iterable
    divs = []
    for length in lengths:
        num_products //= length
        divs.append(num_products)

    for product in products:
        # Generate nth product of iterables
        yield tuple(iterable[(product // div) % len(iterable)]
                    for div, iterable in zip(divs, iterables))

class UnavailableTime:
    """ Class giving availability blocks an interface compatible with meeting objects

    Parameters:
        start_time: datetime.time object for start of unavailable block
        end_time: datetime.time object for end of unavailable block
        meeting_days: int representing day of unavailable block, 0 is Monday and 6 is
                      Sunday
    """
    def __init__(self, start_time: time, end_time: time, day: int):
        self.start_time = start_time
        self.end_time = end_time
        self.meeting_days = set((day,))

    def __eq__(self, other):
        return (self.start_time == other.start_time and self.end_time == other.end_time
                and self.meeting_days == other.meeting_days)

class BasicFilter(enum.Enum):
    """ Represents the allowable values for the honors and remote filters. These are
        'no_preference', 'exclude', and 'only'
    """
    NO_PREFERENCE = 'no_preference'
    EXCLUDE = 'exclude'
    ONLY = 'only'

class CourseFilter(NamedTuple):
    """ Contains the course-specific information needed to query the database for a course
        and filter its sections to the ones that match the user's selections

    Fields:
        subject: string of the subject of the course (ex. CSCE, MATH, ENGL, etc.)
        course_num: course number for the subject
        section_nums: List of section numbers that can be in the schedule, if empty
                      then all are valid
        honors: Whether to include honors, exclude honors, or show only honors sections
        remote: Whether to include remote, exclude remote, or show only remote sections
        #TODO SHOULD THERE BE A NOTE ABOUT ASYNC HERE?
        include_full: Whether to include sections that have no empty seats
    """
    subject: str
    course_num: str
    honors: BasicFilter = BasicFilter.EXCLUDE
    remote: BasicFilter = BasicFilter.NO_PREFERENCE
    asynchronous: BasicFilter = BasicFilter.NO_PREFERENCE
    include_full: bool = False
    section_nums: List[str] = []
