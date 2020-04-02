""" Tests all of the models functions """

from datetime import time
from itertools import product
import unittest
import django.test

from scheduler.create_schedules import _get_meetings, _schedule_valid, create_schedules
from scheduler.utils import random_product, UnavailableTime
from scraper.models import Instructor, Meeting, Section

class SchedulingTests(django.test.TestCase):
    """ Tests for generate_schedules and its helper functions """
    @classmethod
    def setUpTestData(cls):
        instructor = Instructor(id="Akash Tyagi")
        instructor.save()
        cls.sections = [
            Section(crn=12345, id=1, subject='CSCE', course_num='310',
                    section_num='501', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12346, id=2, subject='CSCE', course_num='310',
                    section_num='502', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12347, id=3, subject='CSCE', course_num='310',
                    section_num='503', term_code='201911', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12348, id=4, subject='CSCE', course_num='121',
                    section_num='501', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12349, id=5, subject='CSCE', course_num='121',
                    section_num='502', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
        ]
        Section.objects.bulk_create(cls.sections)

    def assert_meetings_match_expected(self, meetings, valid_sections, section_ids,
                                       meetings_for_sections):
        """ Helper function to check that generated meetings are correct. Fails the test
            if they aren't.

        Args:
            meetings: values returned by _get_meetings
            valid_sections: set of expected section numbers
            section_ids: dict mapping section_num to its id
            meetings_for_sections: dict mapping section_num to the meetings it
                                   should contain
        """
        # Since I modify model data, I can't compare them directly so make sure
        # each section is found in meetings, they are all valid, and there are the correct
        # number of them
        for section, section_meetings in meetings.items():
            self.assertIn(section, valid_sections)

            # Check that all meetings in section_meetings are for the correct section
            actual_section_id = section_ids[section]
            for meeting in section_meetings:
                if meeting.section_id != actual_section_id:
                    self.fail(f"{meeting} not a meeting in section {section}")

            # All actual meetings for section found, check no extras are
            actual_section_meetings = meetings_for_sections[section]
            self.assertEqual(len(section_meetings), len(actual_section_meetings),
                             msg=f"Section {section}: found meetings {section_meetings}"
                                 f", expected {actual_section_meetings}")

        # Check all sections for the course are contained in meetings
        self.assertEqual(len(meetings), len(meetings_for_sections),
                         msg=f"Sections not matching: got {list(meetings.keys())}"
                             f", expected {list(section_ids.keys())}")

    def test__get_meetings_gets_all_meetings(self):
        """ Tests that _get_meetings gets all sections/meetings for the specified term
            and groups them correctly
        """
        # Arrange
        course = ("CSCE", "310")
        term = "201931"
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 310-503
            Meeting(id=30, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[2]),
            Meeting(id=31, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[2]),
        ]
        Meeting.objects.bulk_create(meetings)
        valid_sections = set(("501", "502"))
        meetings_for_sections = {'501': meetings[0:2], '502': meetings[2:4]}
        section_ids = {'501': 1, '502': 2}
        # Act
        meetings = _get_meetings(course, term, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections, section_ids,
                                            meetings_for_sections)

    def test__get_meetings_handles_no_sections(self):
        """ Tests that for a course with no sections, _get_meetings returns
            empty reults
        """
        # Arrange
        course = ("CSCE", "123")
        term = "201931"
        unavailable_times = []

        # Act
        meetings = _get_meetings(course, term, unavailable_times)

        # Assert
        self.assertFalse(meetings)

    def test__get_meetings_handles_unavailability(self):
        """ Tests that _get_meetings filters sections with meetings conflicting
            with the given unavailable_times
        """
        # Arrange
        course = ("CSCE", "310")
        term = "201931"
        unavailable_times = (UnavailableTime(time(8), time(8, 30), 4),)
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 502 should be filtered because of the unavailable time
        valid_sections = set(("501",))
        meetings_for_sections = {'501': meetings[0:2]}
        section_ids = {'501': 1}
        # Act
        meetings = _get_meetings(course, term, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections, section_ids,
                                            meetings_for_sections)

    def test__schedule_valid_true_for_valid_schedule(self):
        """ Tests that _schedule_valid returns true for a valid schedule """
        # Test a schedule for 201931 containing CSCE 310-501 and CSCE 121-501
        # Arrange
        meetings = [
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Convert meetings to expected format (set of days they meet)
        for meeting in meetings:
            meeting.meeting_days = set(i for i, day in enumerate(meeting.meeting_days)
                                       if day)
        meetings = ({"502": meetings[0:2]}, {"502": meetings[2:]})
        schedule = ("502", "502")

        # Act
        valid = _schedule_valid(meetings, schedule)

        # Assert
        self.assertTrue(valid)

    def test__schedule_valid_false_for_invalid_schedule(self):
        """ Tests that _schedule_valid returns false for an invalid schedule """
        # Test a schedule for 201931 containing CSCE 310-501 CSCE 121-501
        # Arrange
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Convert meetings to expected format (set of days they meet)
        for meeting in meetings:
            meeting.meeting_days = set(i for i, day in enumerate(meeting.meeting_days)
                                       if day)
        meetings = ({"501": meetings[0:2]}, {"501": meetings[2:]})
        schedule = ("501", "501")

        # Act
        valid = _schedule_valid(meetings, schedule)

        # Assert
        self.assertFalse(valid)

    def test_create_schedules_creates_all_valid_schedules(self):
        """ Tests that create_schedules makes all valid schedules and doesn't
            return any invalid ones
        """
        # There are 4 possible schedules to generate, 2 are valid
        # Arrange
        courses = (("CSCE", "310"), ("CSCE", "121"))
        term = "201931"
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        expected_schedules = set((('501', '502'), ('502', '502')))
        num_expected_schedules = 2

        # Act
        schedules = create_schedules(courses, term, unavailable_times, num_schedules=10)
        valid_generated_schedules = expected_schedules.intersection(expected_schedules)

        # Act
        self.assertEqual(len(schedules), num_expected_schedules)
        self.assertEqual(len(valid_generated_schedules), len(schedules))

    def test_create_schedules_uses_unavailable_times(self):
        """ Tests that create_schedule filters out the provided unavailable_times. """
        # There are 4 possible schedules to generate, 1 is valid given the
        # unavailable times
        # Arrange
        courses = (("CSCE", "310"), ("CSCE", "121"))
        term = "201931"
        unavailable_times = [UnavailableTime(time(9, 1), time(9, 2), 4)]
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        expected_schedules = set((('502', '502'),))
        num_expected_schedules = 1

        # Act
        schedules = create_schedules(courses, term, unavailable_times, num_schedules=10)
        valid_generated_schedules = expected_schedules.intersection(expected_schedules)

        # Act
        self.assertEqual(len(schedules), num_expected_schedules)
        self.assertEqual(len(valid_generated_schedules), len(schedules))



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
