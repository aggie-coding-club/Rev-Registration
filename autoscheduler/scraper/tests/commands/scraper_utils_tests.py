import unittest
from datetime import datetime
from scraper.management.commands.utils.scraper_utils import (
    get_recent_terms, get_recent_semesters, get_all_terms, get_recent_grades_semester,
    SPRING, SUMMER, FALL,
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
    def test_feb_gives_spring_terms(self):
        """ Tests that when its 2/1/2013, we only get the spring 2013 terms """
        # Arrange
        expected = ['201311', '201312', '201313']
        now = datetime(2013, 2, 1)

        # Act
        result = get_recent_terms(now=now)

        # Assert
        self.assertEqual(expected, result)

    def test_april_gives_summer_and_fall_terms(self):
        """ Tests that 2020/4/1 gives all of the terms for summer/fall 2020 """
        # Arrange
        expected = ['202021', '202022', '202023', '202031', '202032', '202033']
        date = datetime(2020, 4, 1)

        # Act
        result = get_recent_terms(date)

        # Assert
        self.assertEqual(result, expected)

    def test_november_gives_spring_terms_for_next_year(self):
        """ Tests that when it's 11/1/2013, we get spring terms for 2014 """
        # Arrange
        expected = ['201411', '201412', '201413']
        now = datetime(2013, 11, 1)

        # Act
        result = get_recent_terms(now=now)

        # Assert
        self.assertEqual(expected, result)

class GetAllTermsTests(unittest.TestCase):
    """ Tests for get_all_terms """
    def test_get_all_2013(self):
        """ Tests that when it's 2013 and no year is provided,
            all terms in 2013 are returned
        """
        # Arrange
        expected = set(['201311', '201312', '201313', '201321', '201322', '201323',
                        '201331', '201332', '201333'])
        now = datetime(2013, 1, 1)
        # Act
        result = get_all_terms(now=now)
        # Assert
        self.assertEqual(expected, result)

    def test_get_all_2014(self):
        """ Tests that when it's 2014 and no year is provided,
            all terms in 2013 and 2014 are returned
        """
        # Arrange
        expected = set(['201311', '201312', '201313', '201321', '201322', '201323',
                        '201331', '201332', '201333',
                        '201411', '201412', '201413', '201421', '201422', '201423',
                        '201431', '201432', '201433'])
        now = datetime(2014, 1, 1)
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

    def test_year_param_gets_all_of_current_year(self):
        """ For the year parameter, if it's 1/1/2015 and we pass in 2015,
            all terms for 2015 should be returned
        """
        # Arrange
        expected = set(['201511', '201512', '201513', '201521', '201522', '201523',
                        '201531', '201532', '201533'])
        year = 2015
        now = datetime(year, 1, 1)
        # Act
        result = get_all_terms(year=year, now=now)
        # Assert
        self.assertEqual(result, expected)

class GetRecentGradesSemesterTests(unittest.TestCase):
    """ Tests for get_recent_grade_semester() """
    def setUp(self):
        pass

    def test_dec30_2020_is_summer_2020(self):
        """ Tests that if called during 12/30/20, it scrapes Summer 2020 grades """
        # Arrange
        date = datetime(2020, 12, 30)
        expected = (2020, SUMMER)

        # Act
        result = get_recent_grades_semester(date)

        # Assert
        self.assertEqual(expected, result)

    def test_feb05_2021_is_fall_2020(self):
        """ Tests that if called during 02/05/2021, it scrapes Fall 2020 grades """
        # Arrange
        date = datetime(2021, 2, 5)
        expected = (2020, FALL)

        # Act
        result = get_recent_grades_semester(date)

        # Assert
        self.assertEqual(expected, result)

    def test_june05_2021_is_spring_2021(self):
        """ Tests that if called during 06/05/2021, it scrapes Spring 2021 grades """
        # Arrange
        date = datetime(2021, 6, 5)
        expected = (2021, SPRING)

        # Act
        result = get_recent_grades_semester(date)

        # Assert
        self.assertEqual(expected, result)

    def test_oct05_2021_is_summer_2021(self):
        """ Tests that if called during 10/05/2021, it scrapes Summer 2021 grades """
        # Arrange
        date = datetime(2021, 10, 5)
        expected = (2021, SUMMER)

        # Act
        result = get_recent_grades_semester(date)

        # Assert
        self.assertEqual(expected, result)
