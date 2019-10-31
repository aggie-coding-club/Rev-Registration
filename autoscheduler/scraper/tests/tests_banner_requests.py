# import unittest
from django.test import TestCase

from ..banner_requests import generate_session_id, get_term_code, Semester, Location

# Doesn't have anything to do with Django, so no need to use django.test.TestCase

# Some of the tests in here aren't actually within the BannerRequests class, but w/e

class GenerateSessionIDTests(TestCase): # Should just be a unittest.TestCase
    """ stuff """
    def test_is_18_chars(self):
        """ stuff """
        # Arrange/Act
        session_id = generate_session_id()

        # Assert
        length = len(session_id)

        assert length == 18 # Should be 18 characters long

class GetTermCodeTests(TestCase):
    """ Tests get_term_code from banner_requests.py """

    def test_fall_college_station_returns_31(self):
        """ Tests if when given fall semester & at college station if it returns 31 """
        # Arrange
        semester = Semester.fall
        loc = Location.college_station

        # Act
        term_code = get_term_code("2019", semester, loc)

        # Assert
        assert term_code[4:] == "31" # term_code is 201931, but we just want last 2 chars

    def test_spring_galveston_returns_22(self):
        """ Tests if when given spring & at galveston, if the given term ends in 22 """
        # Arrange
        semester = Semester.spring
        loc = Location.galveston

        # Act
        term_code = get_term_code("2019", semester, loc)

        print(term_code)
        # Assert
        assert term_code[4:] == "12"

    def test_invalid_year_does_raise_error(self):
        """ Provides an invalid year(where len != 4) and passes if it throws an error """
        try:
            _ = get_term_code("9", Semester.fall, Location.college_station)

            assert False # If it doesn't raise an error, then didn't pass
        except ValueError:
            assert True
            return


class GetDepartmentsTests(TestCase): # Should just be a unittest.TestCase
    """ Stuff """

    def test_get_depts(self):
        """ stuff """
