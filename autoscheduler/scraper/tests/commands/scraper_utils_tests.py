import unittest
from datetime import datetime
from scraper.management.commands.utils.scraper_utils import (
    get_recent_terms, get_recent_semesters,
)

class GetRecentSemestersTests(unittest.TestCase):
    """ Tests for get_recent_semesters """

    def setUp(self):
        self.spring_2021 = ['20211']
        self.summer_fall_2020 = ['20202', '20203']
        self.summer_fall_2021 = ['20212', '20213']

    def test_dec30_2020_is_spring_2021(self):
        """ Tests that 11/30/2020 results in spring 2021 (20211) """
        date = datetime(2020, 12, 30)
        result = get_recent_semesters(date)

        self.assertEqual(self.spring_2021, result)

    def test_march1_2021_is_spring_2021(self):
        """ Tests that 03/01/2020 results in spring 2021 (20211) """
        date = datetime(2021, 3, 1)
        result = get_recent_semesters(date)

        self.assertEqual(self.spring_2021, result)

    def test_april1_2021_is_summer_fall_2021(self):
        """ Tests that 04/01/2020 results in summer/fall 2021 (20212, 20213) """
        date = datetime(2021, 4, 1)
        result = get_recent_semesters(date)

        self.assertEqual(self.summer_fall_2021, result)

    def test_november5_2020_is_spring_2021(self):
        """ Tests that 11/30/2020 results in spring 2021 (20211) """
        date = datetime(2020, 11, 5)
        result = get_recent_semesters(date)

        self.assertEqual(self.spring_2021, result)

class GetRecentTermsTests(unittest.TestCase):
    """ Tests for get_recent_terms.
        These are really only testing the product functionality of
        get_recent_terms, and really aren't that important.
    """
    def test_does_product_location_and_semesters_correctly(self):
        """ Tests that it does all of the correct locations for summer/fall 2020 """
        date = datetime(2020, 4, 1)
        result = get_recent_terms(date)

        self.assertEqual(result, ['202021', '202022', '202023',
                                  '202031', '202032', '202033'])
