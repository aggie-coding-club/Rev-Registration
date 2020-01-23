import unittest

import PyPDF2

from scraper.management.commands.utils.pdf_parser import (
    calculate_gpa, parse_page, GradeData
)

from scraper.tests.utils.load_json import load_pdf

class PDFParserTests(unittest.TestCase):
    """ Tests for PDF Parsing """

    def setUp(self):
        self.pdf_path = "../data/grd20191AP.pdf"
        self.pdf_input = load_pdf(self.pdf_path) # Only has 2 courses

    def test_calculate_gpa_is_correct(self):
        """ Tests that given an assortment of grades, it calculates it correctly """

        # Arrange

        grades_dict = {
            "A": 3,
            "B": 3,
            "C": 3,
            "D": 3,
            "F": 3,
        }

        expected = 2.0 # ((3*4)+(3*3)+(3*2)+(3*1)+(3*0)) / 15 => 30 / 15

        # Act
        result = calculate_gpa(grades_dict)

        # Assert
        self.assertEqual(expected, result)

    def test_calculate_gpa_all_f_is_0(self):
        """ Tests if given a GPA dist with only F's, that the returned GPA is 0 """

        # Arrange

        grades_dict = {
            "A": 0,
            "B": 0,
            "C": 0,
            "D": 0,
            "F": 10
        }

        # Act
        result = calculate_gpa(grades_dict)

        # Assert
        self.assertEqual(0.0, result)

    def test_calculate_gpa_all_a_is_4(self):
        """ Tests if given a GPA dist with all A's, that the returned GPA is 4.0 """

        # Arrange
        grades_dict = {
            "A": 10,
            "B": 0,
            "C": 0,
            "D": 0,
            "F": 0
        }

        # Act
        result = calculate_gpa(grades_dict)

        # Assert
        self.assertEqual(4.0, result)

    def test_parse_page_matches_test_input(self):
        """ Tests that parse_page calculates the expected output from our test input """

        # Arrange
        pdf_reader = PyPDF2.PdfFileReader(self.pdf_input)

        expected = [
            GradeData("UGST", "492", "550",
                      {"A": 14, "B": 0, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("UGST", "492", "552",
                      {"A": 7, "B": 6, "C": 1, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
        ]

        # Act
        result = parse_page(pdf_reader.getPage(0))

        # Assert
        self.assertEqual(expected, result)
