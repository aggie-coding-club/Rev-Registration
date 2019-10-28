# import unittest
from django.test import TestCase

from ..banner_requests import generate_session_id

# Doesn't have anything to do with Django, so no need to use django.test.TestCase

# Some of the tests in here aren't actually within the BannerRequests class, but w/e

class GenerateSessionIDTests(TestCase): # Should just be a unittest.TestCase
    def test_is18Chars(self):
        # Arrange/Act
        session_id = generate_session_id()

        # Assert
        length = len(session_id)

        self.assertEqual(length, 18) # Should be 18 characters long

class GetDepartmentsTests(TestCase): # Should just be a unittest.TestCase
    def test_getdepts(self):
        pass