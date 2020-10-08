from datetime import time
from rest_framework.test import APITestCase, APIClient
from scraper.models import Course, Department, Instructor, Meeting, Section, Grades
from scraper.serializers import (CourseSerializer, SectionSerializer, TermSerializer,
                                 CourseSearchSerializer, season_num_to_string,
                                 campus_num_to_string, format_time)


class APITests(APITestCase): #pylint: disable=too-many-public-methods
    """ Tests API functionality """
    @classmethod
    def setUpTestData(cls):
        cls.client = APIClient()
        cls.courses = [
            Course(id='CSCE181-201931', dept='CSCE', course_num='181',
                   title='INTRODUCTION TO COMPUTING', term='201931', credit_hours=3),
            Course(id='CSCE315-201931', dept='CSCE', course_num='315',
                   title='PROGRAMMING STUDIO', term='201931', credit_hours=3),
            Course(id='COMM203-201831', dept='COMM', course_num='203',
                   title='PUBLIC SPEAKING', term='201831', credit_hours=3),
            Course(id='COMM203-201931', dept='COMM', course_num='203',
                   title='PUBLIC SPEAKING', term='201931', credit_hours=3),
            Course(id='LAW7500S-202031', dept='LAW', course_num='7500S',
                   title='SPORTS LAW', term='202031', credit_hours=None),
            Course(id='CSCE181-201731', dept='CSCE', course_num='181',
                   title='INTRODUCTION TO COMPUTING', term='201731', credit_hours=3),
            Course(id='CSCE310-201731', dept='CSCE', course_num='310',
                   title='DATABASE SYSTEMS', term='201731', credit_hours=3),
            Course(id='CSCE315-201731', dept='CSCE', course_num='315',
                   title='PROGRAMMING STUDIO', term='201731', credit_hours=3)
        ]
        cls.instructors = [
            Instructor(id='Akash Tyagi'),
            Instructor(id='John Moore'),
        ]
        Instructor.objects.bulk_create(cls.instructors)
        cls.sections = [
            Section(crn=12345, id='000001', subject='CSCE', course_num='310',
                    section_num='501', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50, asynchronous=False,
                    current_enrollment=40, instructor=cls.instructors[0]),
            Section(crn=12346, id='000002', subject='CSCE', course_num='310',
                    section_num='502', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50, asynchronous=False,
                    current_enrollment=40, instructor=cls.instructors[1]),
            Section(crn=35304, id='000003', subject='ASCC', course_num='101',
                    section_num='502', term_code='201911', min_credits='0',
                    honors=False, web=False, max_enrollment=25, asynchronous=False,
                    current_enrollment=24, instructor=cls.instructors[0]),
            Section(crn=36169, id='000004', subject='ASCC', course_num='101',
                    section_num='502', term_code='201931', min_credits='0',
                    honors=False, web=False, max_enrollment=25, asynchronous=False,
                    current_enrollment=11, instructor=cls.instructors[0]),
            Section(crn=36168, id='000005', subject='ASCC', course_num='101',
                    section_num='502', term_code='201831', min_credits='0',
                    honors=False, web=False, max_enrollment=25, asynchronous=False,
                    current_enrollment=17, instructor=cls.instructors[0]),
            Section(crn=27357, id='000006', subject='CSCE', course_num='310',
                    section_num='500', term_code='201911', min_credits='3',
                    honors=False, web=False, max_enrollment=59, asynchronous=False,
                    current_enrollment=59, instructor=cls.instructors[1]),
            Section(crn=24813, id='000007', subject='BIMS', course_num='110',
                    section_num='501', term_code='201831', min_credits='1',
                    honors=False, web=False, max_enrollment=100, asynchronous=False,
                    current_enrollment=101, instructor=cls.instructors[0]),
            Section(crn=24814, id='000008', subject='BIMS', course_num='110',
                    section_num='500', term_code='201911', min_credits='1',
                    honors=False, web=False, max_enrollment=100, asynchronous=False,
                    current_enrollment=100, instructor=cls.instructors[0]),
        ]
        cls.meetings = [
            Meeting(id='0000010', building='ZACH', meeting_days=[True] * 7,
                    start_time=time(11, 30), end_time=time(12, 20), meeting_type='LEC',
                    section=cls.sections[0]),
            Meeting(id='0000011', building='ZACH', meeting_days=[True] * 7,
                    start_time=time(9, 10), end_time=time(10), meeting_type='LEC',
                    section=cls.sections[0]),
            Meeting(id='0000020', building='ZACH', meeting_days=[True] * 7,
                    start_time=time(11, 30), end_time=time(12, 20), meeting_type='LEC',
                    section=cls.sections[1]),
            Meeting(id='0000021', building='ZACH', meeting_days=[False] * 7,
                    start_time=time(9, 10), end_time=time(10), meeting_type='LAB',
                    section=cls.sections[1]),
        ]
        cls.grades = [
            Grades(section_id='000003', gpa=3.0, A=0, B=1, C=0, D=0, F=0, I=0, S=0,
                   U=0, Q=0, X=0),
            Grades(section_id='000004', gpa=4.0, A=1, B=0, C=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
            Grades(section_id='000005', gpa=2, A=0, B=0, C=1, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
            Grades(section_id='000006', gpa=1, A=0, B=0, C=0, D=0, F=0, I=0, S=0,
                   U=0, Q=0, X=0),
            Grades(section_id='000007', gpa=3, A=1, B=0, C=1, D=0, F=0, I=0, S=0,
                   U=0, Q=0, X=0),
            Grades(section_id='000008', gpa=2, A=0, B=0, C=1, D=0, F=0, I=0, S=0,
                   U=0, Q=0, X=0),
        ]
        Course.objects.bulk_create(cls.courses)
        Section.objects.bulk_create(cls.sections)
        Meeting.objects.bulk_create(cls.meetings)
        Grades.objects.bulk_create(cls.grades)

    def assert_dicts_equal_same_order(self, dict1, dict2):
        """ Fails the test if dict1 and dict2 don't have the same values or their keys
            are in a different order. Used to test the order of /api/terms is correct
        """
        self.assertEqual(list(dict1.keys()), list(dict2.keys()))
        self.assertEqual(dict1, dict2)

    def test_api_terms_orders_by_year(self):
        """ Tests that /api/terms sorts descending by year """
        # Arrange
        expected = {
            'Fall 2020 - College Station': '202031',
            'Fall 2019 - College Station': '201931',
            'Fall 2018 - College Station': '201831',
        }
        # Save departments to the database so they can be queried by /api/terms
        depts = [
            Department(id='CSCE201831', code='CSCE', term='201831'),
            Department(id='CSCE201931', code='CSCE', term='201931'),
            Department(id='CSCE202031', code='CSCE', term='202031'),
        ]
        Department.objects.bulk_create(depts)

        # Act
        response = self.client.get('/api/terms')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assert_dicts_equal_same_order(expected, response.json())

    def test_api_terms_orders_by_semester(self):
        """ Tests that /api/terms shows semesters that come later first """
        # Arrange
        expected = {
            'Fall 2020 - College Station': '202031',
            'Summer 2020 - College Station': '202021',
            'Spring 2020 - College Station': '202011',
        }
        # Save departments to the database so they can be queried by /api/terms
        depts = [
            Department(id='CSCE202031', code='CSCE', term='202031'),
            Department(id='CSCE202021', code='CSCE', term='202021'),
            Department(id='CSCE202011', code='CSCE', term='202011'),
        ]
        Department.objects.bulk_create(depts)

        # Act
        response = self.client.get('/api/terms')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assert_dicts_equal_same_order(expected, response.json())

    def test_api_terms_orders_by_location(self):
        """ Tests that /api/terms shows terms from College Station first, then terms
            in Galveston, then terms in Qatar
        """
        # Arrange
        expected = {
            'Fall 2020 - College Station': '202031',
            'Fall 2020 - Galveston': '202032',
            'Fall 2020 - Qatar': '202033',
        }
        # Save departments to the database so they can be queried by /api/terms
        depts = [
            Department(id='CSCE202031', code='CSCE', term='202031'),
            Department(id='CSCE202032', code='CSCE', term='202032'),
            Department(id='CSCE202033', code='CSCE', term='202033'),
        ]
        Department.objects.bulk_create(depts)

        # Act
        response = self.client.get('/api/terms')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assert_dicts_equal_same_order(expected, response.json())

    def test_api_course_serializer_gives_expected_output(self):
        """ Tests that the course serializer yields the correct data """
        # Arrange
        expected = {'title': 'INTRODUCTION TO COMPUTING', 'credit_hours': 3}

        # Act
        serializer = CourseSerializer(self.courses[0])

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_course_serializer_handles_null_credit_hours(self):
        """ Tests that the course serializer correctly handles null credit_hours """
        # Arrange
        expected = {'title': 'SPORTS LAW', 'credit_hours': None}

        # Act
        serializer = CourseSerializer(self.courses[4])

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_course_gives_valid_response_csce(self):
        """ Tests that /api/course?dept=CSCE&course_num=181&term=201931 gives the
            correct output
        """
        # Arrange
        expected = {'title': 'INTRODUCTION TO COMPUTING', 'credit_hours': 3}
        data = {'dept': 'CSCE', 'course_num': '181', 'term': '201931'}

        # Act
        response = self.client.get('/api/course', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_gives_valid_response_law(self):
        """ Tests that /api/course?dept=LAW&course_num=7500S&term=202031 gives the
            correct output (verifies API can handle null credit_hours)
        """
        # Arrange
        expected = {'title': 'SPORTS LAW', 'credit_hours': None}
        data = {'dept': 'LAW', 'course_num': '7500S', 'term': '202031'}

        # Act
        response = self.client.get('/api/course', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_section_serializer_format_time_handles_null(self):
        """ Tests that the section serializer's format_time(time) function handles
            a None time
        """
        # Arrange
        test_time = None
        expected = ''

        # Act
        result = format_time(test_time)

        # Assert
        self.assertEqual(expected, result)

    def test_api_section_serializer_format_time_handles_hour(self):
        """ Tests that the section serializer's format_time(time) function handles
            a time with 0 minutes
        """
        # Arrange
        test_time = time(10)
        expected = '10:00'

        # Act
        result = format_time(test_time)

        # Assert
        self.assertEqual(expected, result)

    def test_api_section_serializer_format_time_handles_leading_zero(self):
        """ Tests that the section serializer's format_time(time) function pads zeroes
            to a time with hour < 10 (ex. time(9) -> '09:00'
        """
        # Arrange
        test_time = time(9)
        expected = '09:00'

        # Act
        result = format_time(test_time)

        # Assert
        self.assertEqual(expected, result)

    def test_api_section_serializer_format_time_handles_minutes(self):
        """ Tests that the section serializer's format_time(time) function formats
            minutes correctly
        """
        # Arrange
        test_time = time(9, 10)
        expected = '09:10'

        # Act
        result = format_time(test_time)

        # Assert
        self.assertEqual(expected, result)

    def test_api_section_serializer_gives_expected_output(self):
        """ Tests that the section serializer yields the correct data """
        # Arrange
        first_start = '11:30'
        first_end = '12:20'
        second_start = '09:10'
        second_end = '10:00'
        meeting_days = [True] * 7
        expected = {
            'id': 1,
            'crn': 12345,
            'subject': 'CSCE',
            'course_num': '310',
            'min_credits': 3,
            'max_credits': None,
            'instructor_name': 'Akash Tyagi',
            'honors': False,
            'current_enrollment': 40,
            'max_enrollment': 50,
            'meetings': [
                {
                    'id': '10',
                    'building': 'ZACH',
                    'days': meeting_days,
                    'start_time': first_start,
                    'end_time': first_end,
                    'type': 'LEC',
                },
                {
                    'id': '11',
                    'building': 'ZACH',
                    'days': meeting_days,
                    'start_time': second_start,
                    'end_time': second_end,
                    'type': 'LEC',
                },
            ],
            'section_num': '501',
            'web': False,
            'asynchronous': False,
            'grades': None,
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
        first_start = '11:30'
        first_end = '12:20'
        second_start = '09:10'
        second_end = '10:00'
        meeting_days_true = [True] * 7
        meeting_days_false = [False] * 7
        expected = [
            {
                'id': 1,
                'crn': 12345,
                'subject': 'CSCE',
                'course_num': '310',
                'min_credits': 3,
                'max_credits': None,
                'instructor_name': 'Akash Tyagi',
                'honors': False,
                'current_enrollment': 40,
                'max_enrollment': 50,
                'meetings': [
                    {
                        'id': '10',
                        'building': 'ZACH',
                        'days': meeting_days_true,
                        'start_time': first_start,
                        'end_time': first_end,
                        'type': 'LEC',
                    },
                    {
                        'id': '11',
                        'building': 'ZACH',
                        'days': meeting_days_true,
                        'start_time': second_start,
                        'end_time': second_end,
                        'type': 'LEC',
                    }
                ],
                'section_num': '501',
                'web': False,
                'asynchronous': False,
                'grades': None,
            },
            {
                'id': 2,
                'crn': 12346,
                'subject': 'CSCE',
                'course_num': '310',
                'min_credits': 3,
                'max_credits': None,
                'instructor_name': 'John Moore',
                'honors': False,
                'current_enrollment': 40,
                'max_enrollment': 50,
                'meetings': [
                    {
                        'id': '20',
                        'building': 'ZACH',
                        'days': meeting_days_true,
                        'start_time': first_start,
                        'end_time': first_end,
                        'type': 'LEC',
                    },
                    {
                        'id': '21',
                        'building': 'ZACH',
                        'days': meeting_days_false,
                        'start_time': second_start,
                        'end_time': second_end,
                        'type': 'LAB',
                    },
                ],
                'section_num': '502',
                'web': False,
                'asynchronous': False,
                'grades': {
                    'gpa': 1, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0, 'I': 0, 'S': 0,
                    'U': 0, 'Q': 0, 'X': 0, "count": 1,
                }
            },
        ]
        data = {'dept': 'CSCE', 'course_num': 310, 'term': '201931'}

        # Act
        response = self.client.get('/api/sections', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_cs(self):
        """ Tests that /api/course/search filters courses that don't match the entire
            search term
        """
        # Arrange
        expected = {'results': ['CSCE 181 - INTRODUCTION TO COMPUTING',
                                'CSCE 315 - PROGRAMMING STUDIO']}
        data = {'search': 'CS', 'term': '201931'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_c(self):
        """ Tests that /api/course/search gives the correct response for a search
            containing only uppercase letters
        """
        # Arrange
        expected = {'results': ['COMM 203 - PUBLIC SPEAKING',
                                'CSCE 181 - INTRODUCTION TO COMPUTING',
                                'CSCE 315 - PROGRAMMING STUDIO']}
        data = {'search': 'C', 'term': '201931'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_csce_3(self):
        """ Tests that /api/course/search gives the correct response for a search
            containing uppercase letters and a number
        """
        # Arrange
        expected = {'results': ['CSCE 310 - DATABASE SYSTEMS',
                                'CSCE 315 - PROGRAMMING STUDIO']}
        data = {'search': 'CSCE%203', 'term': '201731'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_csce_lower(self):
        """ Tests that /api/course/search gives the correct response for a search
            containing only lowercase letters
        """
        # Arrange
        expected = {'results': ['CSCE 181 - INTRODUCTION TO COMPUTING',
                                'CSCE 310 - DATABASE SYSTEMS',
                                'CSCE 315 - PROGRAMMING STUDIO']}
        data = {'search': 'csce', 'term': '201731'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_csce_3_lower(self):
        """ Tests that /api/course/search gives the correct response for a search
            containing lowercase letters and a number
        """
        # Arrange
        expected = {'results': ['CSCE 310 - DATABASE SYSTEMS',
                                'CSCE 315 - PROGRAMMING STUDIO']}
        data = {'search': 'csce%203', 'term': '201731'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_csce_space_310_lower(self):
        """ Tests that /api/course/search gives the correct response for a search
            containing a space not already in %20
        """
        # Arrange
        expected = {'results': ['CSCE 310 - DATABASE SYSTEMS']}
        data = {'search': 'csce 310', 'term': '201731'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_course_search_gives_correct_results_by_title(self):
        """ Tests that /api/course/search gives the correct response for a search
            by title
        """
        # Arrange
        expected = {'results': ['CSCE 310 - DATABASE SYSTEMS']}
        data = {'search': 'Database%20S', 'term': '201731'}

        # Act
        response = self.client.get('/api/course/search', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_term_serializer_gives_expected_output_non_professional(self):
        """ Tests that the term serializer yields the correct data for
            a non professional term
        """
        # Arrange
        expected = {
            'term' : '201831',
            'desc': 'Fall 2018 - College Station'
        }
        dept = Department(id='CSCE201831', code='CSCE', term='201831')

        # Act
        serializer = TermSerializer(dept)

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_term_serializer_gives_expected_output_professional(self):
        """ Tests that the term serializer yields the correct data for
            a professional term
        """
        # Arrange
        expected = {
            'term' : '201941',
            'desc': 'Full Yr Professional 2019 - 2020'
        }
        dept = Department(id='DDDS201941', code='DDDS', term='201941')

        # Act
        serializer = TermSerializer(dept)

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_season_num_to_string_handles_defined_season_correctly(self):
        """ Tests season_num_to_string function called in TermSerializer for all season
            translations in dicitonary
        """
        # Arrange
        expected = ['Spring', 'Summer', 'Fall', 'Full Yr Professional']

        # Act
        result = [season_num_to_string(i) for i in range(1, 5)]

        # Assert
        self.assertEqual(expected, result)

    def test_season_num_to_string_handles_undefined_season_correctly(self):
        """ Tests season_num_to_string function called in TermSerializer for value not
            in translation dictionary
        """
        # Arrange
        expected = 'NO SEASON'

        # Act
        result = season_num_to_string(17)

        # Assert
        self.assertEqual(expected, result)

    def test_campus_num_to_string_handles_defined_campus_correctly(self):
        """ Tests campus_num_to_string function called in TermSerializer for all campus
            translations in dictionary
        """
        # Arrange
        expected = ['College Station', 'Galveston', 'Qatar', 'Half Year Term']

        # Act
        result = [campus_num_to_string(i) for i in (1, 2, 3, 5)]

        # Assert
        self.assertEqual(expected, result)

    def test_campus_num_to_string_handles_undefined_campus_correctly(self):
        """ Tests campus_num_to_string function called in TermSerializer for value not in
            translation dictionary
        """
        # Arrange
        expected = 'NO CAMPUS'

        # Act
        result = campus_num_to_string(17)

        # Assert
        self.assertEqual(expected, result)

    def test_api_term_serializer_get_desc_correctly_formats_non_professional_term(self):
        """ Checks that get_desc function in TermSerializer correctly combines components
            when formatting a non professional term
        """
        # Arrange
        expected = "Fall 2018 - College Station"
        dept = Department(id='CSCE201831', code='CSCE', term='201831')

        # Act
        result = TermSerializer.get_desc(self, dept)

        # Assert
        self.assertEqual(expected, result)

    def test_api_term_serializer_get_desc_correctly_formats_professional_term(self):
        """ Checks that get_desc function in TermSerializer correctly combines components
            when formatting a professional term
        """
        # Arrange
        expected = "Full Yr Professional 2019 - 2020"
        dept = Department(id='DDDS201941', code='DDDS', term='201941')

        # Act
        result = TermSerializer.get_desc(self, dept)

        # Assert
        self.assertEqual(expected, result)

    def test_api_course_search_serializer_gives_expected_output(self):
        """ Tests that the course search serializer returns the correct data """
        # Arrange
        expected = {'course' : 'CSCE 181 - INTRODUCTION TO COMPUTING'}

        # Act
        serializer = CourseSearchSerializer(self.courses[0])

        # Assert
        self.assertEqual(expected, serializer.data)

    def test_api_course_search_serializer_get_course_formats_correctly(self):
        """ Tests that the get_course function in CourseSearchSerializer
            correctly combines components
        """
        # Arrange
        expected = "CSCE 181 - INTRODUCTION TO COMPUTING"

        # Act
        result = CourseSearchSerializer.get_course(self, self.courses[0])

        # Assert
        self.assertEqual(expected, result)

    def test_api_grade_gives_expected_response_all_sections_ascc_101_tyagi(self):
        """ Tests that the api/grades returns the correct data for all sections
            of a course for an instructor """
        # Arrange
        expected = {"gpa": 3, "A": 1, "B": 1, "C": 1, "D": 0, "F": 0, "I": 0,
                    "S": 0, "U": 0, "Q": 0, "X": 0, "count": 3, }
        data = {'subject': 'ASCC', 'course_num': '101', 'instructor': 'Akash Tyagi'}

        # Act
        response = self.client.get('/api/grades', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_grade_serializer_gives_expected_output_one_section_csce_310_moore(self):
        """ Tests that api/grades returns the correct data for one section of
            a course for an instructor """
        # Arrange
        expected = {"gpa": 1, "A": 0, "B": 0, "C": 0, "D": 0, "F": 0, "I": 0,
                    "S": 0, "U": 0, "Q": 0, "X": 0, "count": 1, }
        data = {'subject': 'CSCE', 'course_num': '310', 'instructor': 'John Moore'}

        # Act
        response = self.client.get('/api/grades', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_grades_gives_valid_response_bims_110_tyagi(self):
        """ Tests that /api/grades?subject=BIMS&course_num=110&
            instructor=Akash Tyagi gives the correct output
        """
        # Arrange
        expected = {"gpa": 2.5, "A": 1, "B": 0, "C": 2, "D": 0, "F": 0, "I": 0,
                    "S": 0, "U": 0, "Q": 0, "X": 0, "count": 2, }
        data = {'subject': 'BIMS', 'course_num': '110', 'instructor': 'Akash Tyagi'}

        # Act
        response = self.client.get('/api/grades', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_api_grades_gives_correct_results_bims_lower_110_tyagi(self):
        """ Tests that /api/grades gives the correct response for a search
            containing lowercase letters in the subject parameter
        """
        # Arrange
        expected = {"gpa": 2.5, "A": 1, "B": 0, "C": 2, "D": 0, "F": 0, "I": 0,
                    "S": 0, "U": 0, "Q": 0, "X": 0, "count": 2, }
        data = {'subject': 'bims', 'course_num': '110', 'instructor': 'Akash Tyagi'}

        # Act
        response = self.client.get('/api/grades', data=data)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
