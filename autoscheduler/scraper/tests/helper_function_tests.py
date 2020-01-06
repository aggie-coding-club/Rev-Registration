import datetime
import django.test

from scraper.management.commands.scrape_courses import convert_meeting_time
from scraper.models.section import generate_meeting_id

class HelperFunctionTests(django.test.TestCase):
    """ Tests helper functions """

    def test_can_generate_meeting_time(self):
        """ Tests that scrape_courses.convert_meeting_time can handle a normal time """

        # Arrange/Act
        time = convert_meeting_time("1230")

        # Assert
        self.assertEqual(time, datetime.time(12, 30))

    def test_can_generate_null_meeting_time(self):
        """ Tests that scrape_courses.convert_meeting_time can handle Null times """

        # Arrange/Act
        time = convert_meeting_time(None)

        # Assert
        self.assertEqual(time, None)

    def test_can_generate_meeting_id(self):
        """ Tests that section.generate_meeting_id correctly generates id """

        # Arrange/Act
        meeting_id = generate_meeting_id("123456", "0")

        # Assert
        self.assertEqual(meeting_id, "1234560")
