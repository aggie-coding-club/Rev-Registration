from unittest.mock import patch
from datetime import time
from rest_framework.test import APITestCase, APIClient
from scheduler.views import (_parse_course_filter, _parse_unavailable_time,
                             _serialize_schedules)
from scheduler.utils import UnavailableTime, CourseFilter, BasicFilter
from scraper.models import Section, Instructor
from scraper.serializers import SectionSerializer

class SchedulingAPITests(APITestCase):
    """ Tests for the functionality in scheduling.views """

    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()

        instructor = Instructor(id="name")
        instructor.save()
        cls.sections = [
            Section(id=1, crn=1, subject='CSCE', course_num='121', section_num='501',
                    term_code='201931', min_credits=0, honors=False, web=False,
                    current_enrollment=0, max_enrollment=0, instructor=instructor,
                    asynchronous=False),
            Section(id=2, crn=2, subject='CSCE', course_num='221', section_num='501',
                    term_code='201931', min_credits=0, honors=False, web=False,
                    current_enrollment=0, max_enrollment=0, instructor=instructor,
                    asynchronous=False),
        ]
        Section.objects.bulk_create(cls.sections)

    def test_parse_course_filter_is_correct(self):
        """ Tests that _parse_counter_filter works on a typical input """

        # Arrange
        course = {
            "subject": "CSCE",
            "courseNum": "121",
            "sections": ["500"],
            "honors": "exclude",
            "web": "exclude",
            "asynchronous": "exclude",
        }

        expected = CourseFilter(subject="CSCE", course_num="121", section_nums=["500"],
                                honors=BasicFilter.EXCLUDE, web=BasicFilter.EXCLUDE,
                                asynchronous=BasicFilter.EXCLUDE)

        # Act
        result = _parse_course_filter(course)

        # Assert
        self.assertEqual(result, expected)

    def test_parse_unavailable_time_is_correct(self):
        """ Tests that _parse_unavailable_times works on a typical input """

        # Arrange
        availability = {
            "startTime": "0800",
            "endTime": "1000",
            "day": 0,
        }

        expected = UnavailableTime(time(8, 00), time(10, 00), 0)

        # Act
        result = _parse_unavailable_time(availability)

        # Assert
        self.assertEqual(result, expected)

    def test_serialize_schedules_is_correct(self):
        """ Tests that _serialize_schedule works on a typical input """

        # Arrange
        schedule = [(1, 2)]

        expected = [
            [SectionSerializer(section).data for section in self.sections]
        ]

        # Act
        result = _serialize_schedules(schedule)

        # Assert
        self.assertEqual(result, expected)

    # Replaces the create_schedules import that's imported in scheduler.views
    @patch('scheduler.views.create_schedules')
    def test_route_scheduling_generate_is_correct(self, create_schedules_mock):
        """ Tests that /scheduling/generate evaluates correctly """

        # Arrange
        # Mock create schedules so we don't have to make the meetings for the sections
        create_schedules_mock.return_value = [(1, 2)]

        request_body = {
            "term": "201931",
            "courses": [
                {
                    "subject": "CSCE",
                    "courseNum": 221,
                    "sections": [],
                    "honors": "exclude",
                    "web": "exclude",
                    "asynchronous": "exclude",
                },
                {
                    "subject": "CSCE",
                    "courseNum": 121,
                    "sections": [],
                    "honors": "exclude",
                    "web": "exclude",
                    "asynchronous": "exclude",
                },
            ],
            "availabilities": [],
            "includeFull": True,
        }

        expected = {
            'schedules': [[SectionSerializer(section).data for section in self.sections]],
            'message': '',
        }

        # Act
        result = self.client.post('/scheduler/generate', request_body, format='json')
        result = result.json()

        # Assert
        self.assertEqual(result, expected)
