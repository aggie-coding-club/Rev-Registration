""" Tests all of the models functions """

import unittest

from scraper.models.department import generate_department_id
from scraper.models.course import generate_course_id

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
