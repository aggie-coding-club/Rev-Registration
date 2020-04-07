import django.test

from scraper.management.commands.scrape_grades import (
    scrape_pdf, generate_term_with_location
)

from scraper.management.commands.utils.pdf_parser import GradeData
from scraper.models import Section, Instructor, Grades

class ScrapeGradesTests(django.test.TestCase):
    """ Tests scrape_grades related functions """

    def test_generate_term_with_location_is_correct(self):
        """ Tests that generate_term_with_location correctly combines a year_semester term
            with a location
        """

        # Arrange
        year_semester_term = "20193" # Fall 2019
        location = "1"
        expected = "201931"

        # Act
        result = generate_term_with_location(year_semester_term, location)

        # Assert
        self.assertEqual(expected, result)

class ScrapeGradesScrapePDFTests(django.test.TestCase):
    """ Tests scrape_grades.scrape_pdf

        This is its own test class since the setUpTestData is only needed for
        scrape_pdf
    """

    @classmethod
    def setUpTestData(cls):
        term = "201911"

        instructor = Instructor(id="Name Name", email_address="email@tamu.edu")
        instructor.save()

        cls.section = Section(id=1, subject="CSCE", course_num="121",
                              section_num="500", term_code=term, min_credits=0,
                              current_enrollment=0, max_enrollment=0,
                              instructor=instructor)

        cls.section.save()

    def test_scrape_pdf_is_correct(self):
        """ Tests that scrape_pdf works on a normal input """

        # Arrange
        grade_dists = [
            GradeData(dept='CSCE', course_num='121', section_num='500',
                      letter_grades={'A': 1, 'B': 0, 'C': 0, 'D': 0, 'F': 0,
                                     'I': 0, 'S': 0, 'U': 0, 'Q': 0, 'X': 0},
                      gpa=4.0),
        ]

        term = "201911"

        expected = [
            Grades(A=1, B=0, C=0, D=0, F=0, I=0, S=0, U=0, Q=0, X=0, gpa=4.0,
                   section=self.section),
        ]

        # Act
        result = scrape_pdf(grade_dists, term)

        # Assert
        self.assertEqual(expected, result)

    def test_scrape_pdf_returns_empty_on_section_not_found(self):
        """ Tests that scrape_pdf returns an empty list when the Sections aren't
            stored in the database
        """

        # Arrange
        grade_dists = [
            GradeData(dept='ENGR', course_num='111', section_num='500',
                      letter_grades={'A': 1, 'B': 0, 'C': 0, 'D': 0, 'F': 0,
                                     'I': 0, 'S': 0, 'U': 0, 'Q': 0, 'X': 0},
                      gpa=4.0),
        ]

        term = "201911"

        # Act
        result = scrape_pdf(grade_dists, term)

        result = len(result)

        # Assert
        self.assertEqual(0, result)
