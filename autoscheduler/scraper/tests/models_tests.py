""" Tests all of the models functions """

import unittest
import django.test

from scraper.models.course import generate_course_id
from scraper.models.department import generate_department_id
from scraper.models.section import generate_meeting_id, Section
from scraper.models.grades import Grades
from scraper.models.instructor import Instructor

class DepartmentTests(unittest.TestCase):
    """ Department model tests """
    def test_generate_department_id_does_form(self):
        """ Tests if generate_department_id works correctly """

        expected = "CSCE-201931"
        result = generate_department_id("CSCE", "201931")

        self.assertEqual(result, expected)

class CourseTests(unittest.TestCase):
    """ Course model tests """

    def test_generate_course_id_does_form(self):
        """ Tests if generate_course_id works correctly """

        expected = "CSCE121-201931"
        result = generate_course_id("CSCE", "121", "201931")

        self.assertEqual(result, expected)

class MeetingTests(unittest.TestCase):
    """ Meeting model tests """
    def test_generate_meeting_id_returns_correct_id(self):
        """ Tests that section.generate_meeting_id correctly generates id """

        # Act
        meeting_id = generate_meeting_id("123456", "0")

        # Assert
        self.assertEqual(meeting_id, "1234560")

class GradesTests(django.test.TestCase):
    """ Tests for Grades model + GradeManager """

    def test_instructor_performances_calculates_from_all_terms(self):
        """ Tests that instructor performance uses all of the
            sections from different terms
        """

        # Arrange
        instructor = Instructor(id="First Last", email_address="last@tamu.edu")
        instructor.save()
        subject = "CSCE"
        course_num = 121

        sections = [
            Section(id=10, subject=subject, course_num=course_num, instructor=instructor,
                    term_code=201931, section_num=500, min_credits=3, honors=False,
                    current_enrollment=0, max_enrollment=10),
            Section(id=11, subject=subject, course_num=course_num, instructor=instructor,
                    term_code=201831, section_num=500, min_credits=3, honors=False,
                    current_enrollment=0, max_enrollment=10),
        ]

        Section.objects.bulk_create(sections)

        grades = [
            Grades(section=sections[0], gpa=4.0, A=1, B=0, C=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
            Grades(section=sections[1], gpa=3.0, B=1, A=0, C=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
        ]

        Grades.objects.bulk_create(grades)

        expected = {
            "gpa": 3.5, "A": 1, "B": 1, "count": 2, # Values that matter
            "C": 0, "D": 0, "F": 0, "I": 0, "S": 0, "U": 0, "Q": 0, "X": 0
        }

        # Act
        result = Grades.objects.instructor_performance(
            dept=subject, course_num=course_num, instructor=instructor, honors=False
        )

        # Assert
        self.assertEqual(expected, result)

    def test_instructor_performance_calculates_from_all_sections(self):
        """ Tests that instructor performance uses all sections of a single term
            to calculate the averages/sums

            Is basically identical to previous test, except the sections are the same term
        """

        # Arrange
        instructor = Instructor(id="First Last", email_address="last@tamu.edu")
        instructor.save()
        subject = "CSCE"
        course_num = 121
        term = 201931

        sections = [
            Section(id=10, subject=subject, course_num=course_num, instructor=instructor,
                    term_code=term, section_num=500, min_credits=3, honors=False,
                    current_enrollment=0, max_enrollment=10),
            Section(id=11, subject=subject, course_num=course_num, instructor=instructor,
                    term_code=term, section_num=500, min_credits=3, honors=False,
                    current_enrollment=0, max_enrollment=10),
        ]

        Section.objects.bulk_create(sections)

        grades = [
            Grades(section=sections[0], gpa=2.0, C=1, A=0, B=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
            Grades(section=sections[1], gpa=3.0, B=1, A=0, C=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
        ]

        Grades.objects.bulk_create(grades)

        expected = {
            "gpa": 2.5, "A": 0, "B": 1, "C": 1, "count": 2, # Values that matter
            "D": 0, "F": 0, "I": 0, "S": 0, "U": 0, "Q": 0, "X": 0
        }

        # Act
        result = Grades.objects.instructor_performance(
            dept=subject, course_num=course_num, instructor=instructor, honors=False,
        )

        # Assert
        self.assertEqual(expected, result)

    def test_instructor_performance_ignores_honors_sections_for_non_honors_query(self):
        """ Tests that instructor performance filters out honors grades for a non honors section

            Is basically identical to previous test, except one of the sections is honors now
        """

        # Arrange
        instructor = Instructor(id="First Last", email_address="last@tamu.edu")
        instructor.save()
        subject = "CSCE"
        course_num = 121
        term = 201931

        sections = [
            Section(id=10, subject=subject, course_num=course_num, instructor=instructor,
                    term_code=term, section_num=500, min_credits=3,
                    current_enrollment=0, max_enrollment=10, honors=True),
            Section(id=11, subject=subject, course_num=course_num, instructor=instructor,
                    term_code=term, section_num=500, min_credits=3,
                    current_enrollment=0, max_enrollment=10, honors=False),
        ]

        Section.objects.bulk_create(sections)

        grades = [
            Grades(section=sections[0], gpa=2.0, C=1, A=0, B=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
            Grades(section=sections[1], gpa=3.0, B=1, A=0, C=0, D=0, F=0, I=0, S=0, U=0,
                   Q=0, X=0),
        ]

        Grades.objects.bulk_create(grades)

        expected = {
            "gpa": 3.0, "A": 0, "B": 1, "C": 0, "count": 1, # Values that matter
            "D": 0, "F": 0, "I": 0, "S": 0, "U": 0, "Q": 0, "X": 0 # Values that don't
        }

        # Act
        result = Grades.objects.instructor_performance(
            dept=subject, course_num=course_num, instructor=instructor, honors=False
        )

        # Assert
        self.assertEqual(expected, result)
