import unittest

import PyPDF2

from scraper.management.commands.utils.pdf_parser import (
    calculate_gpa, parse_page, parse_pdf, GradeData
)

from scraper.tests.utils.load_json import load_pdf, generate_path

class PDFParserTests(unittest.TestCase):
    """ Tests for PDF Parsing """

    def setUp(self):
        self.new_pdf_path = "../data/grd20191AP.pdf"
        self.new_pdf_input = load_pdf(self.new_pdf_path) # Only has 2 courses

        self.old_pdf_path = "../data/grd20153MD.pdf"
        self.old_pdf_input = load_pdf(self.old_pdf_path)

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

    def test_parse_page_matches_test_input_new_pdf_style(self):
        """ Tests that parse_page calculates the expected output from our test input
            using the new PDF style (>= 2016 Fall)
        """

        # Arrange
        pdf_reader = PyPDF2.PdfFileReader(self.new_pdf_input)

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

    def test_parse_page_matches_test_input_old_pdf_style(self):
        """ Tests that parse_page calculates the expected output using the old
            PDf style (< 2016 Fall)
        """

        # Arrange
        pdf_reader = PyPDF2.PdfFileReader(self.old_pdf_input)

        expected = [
            GradeData("EDHP", "500", "599",
                      {"A": 6, "B": 1, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("HCPI", "555", "599",
                      {"A": 4, "B": 1, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("MPHY", "601", "600",
                      {"A": 4, "B": 1, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("MSCI", "601", "600",
                      {"A": 3, "B": 5, "C": 1, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("MSCI", "601", "601",
                      {"A": 2, "B": 6, "C": 1, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("MSCI", "609", "305",
                      {"A": 8, "B": 0, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
            GradeData("MSCI", "609", "600",
                      {"A": 9, "B": 0, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, None),
        ]

        # Act
        result = parse_page(pdf_reader.getPage(0))

        # Assert
        self.assertEqual(expected, result)

    def test_parse_pdf_matches_test_input(self):
        """ Tests that parse_pdf calculates GradeData correctly from the test input """

        # Arrange
        gpa552 = (7 * 4.0 + 6 * 3.0 + 1 * 2.0) / 14.0 # GPA for the second course

        # Same data for the parse_page test, but GPA's are included
        expected = [
            GradeData("UGST", "492", "550",
                      {"A": 14, "B": 0, "C": 0, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, 4.0),
            GradeData("UGST", "492", "552",
                      {"A": 7, "B": 6, "C": 1, "D": 0, "F": 0, "I": 0,
                       "S": 0, "U": 0, "Q": 0, "X": 0}, gpa552),
        ]

        # Act
        result = parse_pdf(generate_path(self.new_pdf_path))

        # Assert
        self.assertEqual(expected, result)
