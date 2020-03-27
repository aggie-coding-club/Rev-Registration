from functools import reduce
from operator import mul
from random import sample
from typing import Any, Iterable, Tuple

def random_product(*iterables: Iterable[Iterable], limit=100_000) -> Tuple[Any]:
    """ Generates up to limit (or all possible) random unique cartesian products of
        *iterables. Iterables must be indexable, otherwise it is impossible to
        efficiently create products.

    Args:
        iterables: Iterable containing other iterables to make products of

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
    products = sample(range(num_products), min(num_products, limit))
    # Numbers to divide product by in order to find correct item in each iterable
    divs = []
    for length in lengths:
        num_products //= length
        divs.append(num_products)

    for product in products:
        # Generate nth product of iterables
        yield tuple(iterable[(product // div) % len(iterable)]
                    for div, iterable in zip(divs, iterables))
