from functools import reduce
from operator import mul
from random import sample
from typing import Any, Iterable, Tuple

def random_products(*iterables: Iterable[Iterable], **kwargs) -> Tuple[Any]:
    """ Generates up to limit (or all possible) random cartesian products of *iterables.
        Iterables must be indexable, otherwise it is impossible to efficiently
        create combinations.

    Args:
        iterables: Iterable containing other iterables to make combinations of

    Yields:
        Iterator of tuples containing the random combinations
    """
    limit = kwargs.get("limit", 100_000)
    lengths = tuple(len(iterable) for iterable in iterables)
    num_combinations = reduce(mul, (length for length in lengths)) if iterables else 0
    if num_combinations == 0:
        yield from ()
        return
    combinations = sample(range(num_combinations), min(num_combinations, limit))
    # Numbers to divide n by in order to find correct item in each iterable
    divs = []
    for length in lengths:
        num_combinations //= length
        divs.append(num_combinations)
    for combination in combinations:
        # Generate nth combination of iterables
        yield tuple(iterable[(combination // divs[i]) % len(iterable)]
                    for i, iterable in enumerate(iterables))
