import unittest
from datetime import datetime
from scraper.management.commands.utils.scraper_utils import (
    get_recent_terms, get_recent_semesters, get_all_terms,
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

class GetAllTermsTests(unittest.TestCase):
    """ Tests for get_all_terms """
    def test_feb_is_only_3_terms(self):
        """ Tests that when its 2/1/2013, we only get the spring 2013 terms """
        # Arrange
        expected = set(['201311', '201312', '201313'])
        now = datetime(2013, 2, 1)
        # Act
        result = get_all_terms(now=now)
        # Assert
        self.assertEqual(expected, result)

    def test_may_is_all_terms(self):
        """ Tests that when it's 5/1/2013, we get all terms for 2013 """
        # Arrange
        expected = set(['201311', '201312', '201313', '201321', '201322', '201323',
                        '201331', '201332', '201333'])
        now = datetime(2013, 5, 1)
        # Act
        result = get_all_terms(now=now)
        # Assert
        self.assertEqual(expected, result)

    def test_dec_is_this_year_and_next(self):
        """ Tests that when it's 12/1/2013, we get all terms for 2013 + first semester
            for 2014
        """
        # Arrange
        expected = set(['201311', '201312', '201313', '201321', '201322', '201323',
                        '201331', '201332', '201333', '201411', '201412', '201413'])
        now = datetime(2013, 12, 1)
        # Act
        result = get_all_terms(now=now)
        # Assert
        self.assertEqual(expected, result)

    def test_year_param_gets_all_of_past_year(self):
        """ Tests that when providing a manual year of 2014 (and now is 2015) that we
            get all of the terms for 2014 (and none for 2015)
        """
        # Arrange
        expected = set(['201411', '201412', '201413', '201421', '201422', '201423',
                        '201431', '201432', '201433'])
        year = 2014
        now = datetime(2015, 1, 1)
        # Act
        result = get_all_terms(year=year, now=now)
        # Assert
        self.assertEqual(expected, result)

    def test_year_param_gets_only_recent_terms_for_current_year(self):
        """ For the year parameter, if it's 1/1/2015 and we pass in 2015, we should only
            get the first semesters worth of terms in 2015
        """
        # Arrange
        expected = set(['201511', '201512', '201513'])
        year = 2015
        now = datetime(year, 1, 1)
        # Act
        result = get_all_terms(year=year, now=now)
        # Assert
        print(result, expected)
        self.assertEqual(result, expected)
