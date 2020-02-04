from datetime import time
from rest_framework.test import APITestCase, APIClient
from scraper.models.course import Course
from scraper.models.instructor import Instructor
from scraper.models.section import Section, Meeting
from scraper.serializers import CourseSerializer, SectionSerializer

class APITests(APITestCase):
    """ Tests API functionality """
    def setUp(self):
        self.client = APIClient()
        self.courses = [
            Course(id='123123', dept='CSCE', course_num='181',
                   title='Introduction to Computing', term='201931', credit_hours=3),
            Course(id='123124', dept='CSCE', course_num='315',
                   title='Programming Studio', term='201931', credit_hours=3),
            Course(id='123125', dept='COMM', course_num='203',
                   title='Public Speaking', term='201831', credit_hours=3),
            Course(id='123126', dept='COMM', course_num='203',
                   title='Public Speaking', term='201931', credit_hours=3),
            Course(id='123127', dept='LAW', course_num='7500S',
                   title='Sports Law', term='202031', credit_hours=None),
        ]
        test_instructors = [
            Instructor(id='Akash Tyagi'),
            Instructor(id='John Moore'),
        ]
        for instructor in test_instructors:
            instructor.save()
        self.sections = [
            Section(crn=12345, id='000001', subject='CSCE', course_num='310',
                    section_num='501', term_code='201931', min_credits='3',
                    honors_only=False, web_only=False, max_enrollment=50,
                    current_enrollment=40, instructor=test_instructors[0]),
            Section(crn=12346, id='000002', subject='CSCE', course_num='310',
                    section_num='502', term_code='201931', min_credits='3',
                    honors_only=False, web_only=False, max_enrollment=50,
                    current_enrollment=40, instructor=test_instructors[1],
                    instructor_gpa=3.2),
        ]
        self.meetings = [
            Meeting(id='0000010', meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id='0000011', meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LEC', section=self.sections[0]),
            Meeting(id='0000020', meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id='0000021', meeting_days=[False] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[1]),
        ]
        for course in self.courses:
            course.save()
        for section in self.sections:
            section.save()
        for meeting in self.meetings:
            meeting.save()

    def test_api_terms_displays_all_terms(self):
        """ Tests that /api/terms returns ordered list of all terms in database """
        # Arrange
        expected = {
            '201831': 'Fall 2018 - College Station',
            '201931': 'Fall 2019 - College Station',
            '202031': 'Fall 2020 - College Station',
        }

        # Act
        response = self.client.get('/api/terms')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(expected, response)

    def test_api_course_serializer_gives_expected_output(self):
        """ Tests that the course serializer yields the correct data """
        # Arrange
        expected = {'title': 'Introduction to Computing', 'credit_hours': 3}

        # Act
        serializer = CourseSerializer(self.courses[0])

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_course_serializer_handles_null_credit_hours(self):
        """ Tests that the course serializer correctly handles null credit_hours """
        # Arrange
        expected = {'title': 'Sports Law', 'credit_hours': None}

        # Act
        serializer = CourseSerializer(self.courses[4])

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_course_gives_valid_response_csce(self):
        """ Tests that /api/course?dept=CSCE&course_num=181&term=201931 gives the
            correct output
        """
        # Arrange
        expected = CourseSerializer(self.courses[0])
        data = {'dept': 'CSCE', 'course_num': '181', 'term': '201931'}

        # Act
        response = self.client.get('/api/course', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected.data)

    def test_api_course_gives_valid_response_law(self):
        """ Tests that /api/course?dept=LAW&course_num=7500S&term=202031 gives the
            correct output (verifies API can handle null credit_hours)
        """
        # Arrange
        expected = CourseSerializer(self.courses[4])
        data = {'dept': 'LAW', 'course_num': '7500S', 'term': '202031'}

        # Act
        response = self.client.get('/api/course', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected.data)

    def test_api_section_serializer_gives_expected_output(self):
        """ Tests that the section serializer yields the correct data """
        # Arrange
        first_start = time(11, 30)
        first_end = time(12, 20)
        second_start = time(9, 10)
        second_end = time(10)
        meeting_days = [True] * 7
        expected = {
            'crn': 12345,
            'instructor_gpa': None,
            'instructor_name': 'Akash Tyagi',
            'honors_only': False,
            'meetings': {
                '10': {
                    'days': meeting_days,
                    'start_time': first_start,
                    'end_time': first_end,
                    'type': 'LEC',
                },
                '11': {
                    'days': meeting_days,
                    'start_time': second_start,
                    'end_time': second_end,
                    'type': 'LEC',
                },
            },
            'section_num': '501',
            'web_only': False,
        }

        # Act
        serializer = SectionSerializer(self.sections[0])

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_sections_gives_valid_response(self):
        """ Tests that /api/sections?&dept=CSCE&course_num=310term=201931 gives the
            correct output
        """
        # Arrange
        first_start = time(11, 30)
        first_end = time(12, 20)
        second_start = time(9, 10)
        second_end = time(10)
        meeting_days_true = [True] * 7
        meeting_days_false = [False] * 7
        expected = {
            '1': {
                'crn': 12345,
                'instructor_gpa': None,
                'instructor_name': 'Akash Tyagi',
                'honors_only': False,
                'meetings': {
                    '10': {
                        'days': meeting_days_true,
                        'start_time': first_start,
                        'end_time': first_end,
                        'type': 'LEC',
                    },
                    '11': {
                        'days': meeting_days_true,
                        'start_time': second_start,
                        'end_time': second_end,
                        'type': 'LEC',
                    },
                },
                'section_num': '501',
                'web_only': False,
            },
            '2': {
                'crn': 12346,
                'instructor_gpa': None,
                'instructor_name': 'John Moore',
                'honors_only': False,
                'meetings': {
                    '20': {
                        'days': meeting_days_true,
                        'start_time': first_start,
                        'end_time': first_end,
                        'type': 'LEC',
                    },
                    '21': {
                        'days': meeting_days_false,
                        'start_time': second_start,
                        'end_time': second_end,
                        'type': 'LAB',
                    },
                },
                'section_num': '502',
                'web_only': False,
            },
        }
        data = {'dept': 'CSCE', 'course_num': 310, 'term': '201931'}

        # Act
        response = self.client.get('/api/sections', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_cs(self):
        """ Tests that /api/course/search?search=CS&term=201931 gives correct output """
        # Arrange
        expected = {'results': ['CSCE 181', 'CSCE 315']}
        data = {'search': 'CS', 'term': '201931'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_c(self):
        """ Tests that /api/course/search?search=C&term=201931 gives correct output """
        # Arrange
        expected = {'results': ['COMM 203', 'CSCE 181', 'CSCE 315']}
        data = {'search': 'C', 'term': '201931'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
