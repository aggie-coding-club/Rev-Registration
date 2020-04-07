from itertools import product
import unittest

from scheduler.utils import random_product

class RandomProductTests(unittest.TestCase):
    """ Tests for the random_product helper function """
    def test_random_product_gets_all_products(self):
        """ Tests that random_product generates all unique products if there are
            less than or equal to the limit parameter products possible
        """
        # Arrange
        arrs = [list(range(10)) for _ in range(4)]
        num_schedules = 10_000

        # Act
        random_product_set = set(random_product(*arrs, limit=num_schedules))
        product_set = set(product(*arrs))

        # Assert
        self.assertEqual(random_product_set, product_set)

    def test_random_product_gets_unique_products(self):
        """ Tests that random_product gets only unique products if there are more than
            the provided limit parameter possible
        """
        # Arrange
        arrs = [list(range(10)) for _ in range(4)]
        num_products = 9_999

        # Act
        random_product_set = set(random_product(*arrs, limit=num_products))
        product_set = set(product(*arrs))
        intersection = random_product_set.intersection(product_set)

        # Assert
        self.assertEqual(len(random_product_set), num_products)
        self.assertEqual(len(intersection), num_products)

    def test_random_product_handles_empty_iterable(self):
        """ Tests that random_product generates nothing and doesn't throw an error
            if an iterable provided is empty
        """
        # Arrange
        arrs = [list(range(10)) for _ in range(3)]
        arrs.append([])
        num_products = 1_000

        # Act
        random_product_set = set(random_product(*arrs, limit=num_products))

        # Assert
        self.assertFalse(random_product_set)

    def test_random_product_handles_empty_iterables(self):
        """ Tests that random_product generates nothing and doesn't throw an error
            if the provided iterables are empty
        """
        # Arrange
        arrs = []
        num_products = 100

        # Act
        random_product_set = set(random_product(*arrs, limit=num_products))

        # Assert
        self.assertFalse(random_product_set)
