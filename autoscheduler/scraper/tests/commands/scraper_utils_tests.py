import unittest
from datetime import datetime
from scraper.management.commands.utils.scraper_utils import (
    determine_terms_to_scrape, determine_semesters_to_scrape,
)

class DetermineSemestersToScrapeTests(unittest.TestCase):
    """ Tests for determine_semesters_to_scrape """

    def setUp(self):
        self.strp_format = "%m/%d/%Y"
        self.spring_2021 = ['20211']
        self.summer_fall_2020 = ['20202', '20203']
        self.summer_fall_2021 = ['20212', '20213']

    def test_dec30_2020_is_spring_2021(self):
        """ Tests that 11/30/2020 results in spring 2021 (20211) """
        date = datetime.strptime('12/30/2020', self.strp_format)
        result = determine_semesters_to_scrape(date)

        self.assertEqual(self.spring_2021, result)

    def test_march1_2021_is_spring_2021(self):
        """ Tests that 03/01/2020 results in spring 2021 (20211) """
        date = datetime.strptime('03/01/2021', self.strp_format)
        result = determine_semesters_to_scrape(date)

        self.assertEqual(self.spring_2021, result)

    def test_april1_2021_is_summer_fall_2021(self):
        """ Tests that 04/01/2020 results in summer/fall 2021 (20212, 20213) """
        date = datetime.strptime('04/01/2021', self.strp_format)
        result = determine_semesters_to_scrape(date)

        self.assertEqual(self.summer_fall_2021, result)

    def test_november5_2020_is_spring_2021(self):
        """ Tests that 11/30/2020 results in spring 2021 (20211) """
        date = datetime.strptime('11/05/2020', self.strp_format)
        result = determine_semesters_to_scrape(date)

        self.assertEqual(self.spring_2021, result)

class DetermineTermsToScrapeTests(unittest.TestCase):
    """ Tests for determine_terms_to_scrape.
        These are really only testing the product functionality of
        determine_terms_to_scrape, and really aren't that important.
    """
    def setUp(self):
        self.strp_format = "%m/%d/%Y"

    def test_does_product_location_and_semesters_correctly(self):
        """ Tests that it does all of the correct locations for summer/fall 2020 """
        date = datetime.strptime('04/01/2020', self.strp_format)
        result = determine_terms_to_scrape(date)

        self.assertEqual(result, ['202021', '202022', '202023',
                                  '202031', '202032', '202033'])
