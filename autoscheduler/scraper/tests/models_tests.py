""" Tests all of the models functions """

import unittest

from scraper.models.department import generate_department_id
from scraper.models.course import generate_course_id

# A lot of these funcitons have to be self in order to be part of the TestCase and thus,
# run, but they don't actually use self in their functions, so silence this error
# pylint: disable=no-self-use

class DepartmentTests(unittest.TestCase):
    """ Department model tests """
    def test_generate_department_id_does_form(self):
        """ Tests if generate_department_id works correctly """

        expected = "CSCE-201931"
        result = generate_department_id("CSCE", "201931")

        assert result == expected

class CourseTests(unittest.TestCase):
    """ Course model tests """

    def test_generate_course_id_does_form(self):
        """ Tests if generate_course_id works correctly """

        expected = "CSCE121-201931"
        result = generate_course_id("CSCE", "121", "201931")

        assert result == expected
