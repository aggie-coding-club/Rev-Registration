import unittest

import PyPDF2

import scraper.management.commands.utils.pdf_parser as pdf_parser

from scraper.tests.utils.load_json import load_pdf

class PDFParserTests(unittest.TestCase):
    """ Tests for PDF Parsing """

    def test_calculate_gpa_is_correct(self):
        """ Tests that given an assortment of grades, t """

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
        result = pdf_parser.calculate_gpa(grades_dict)

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
        result = pdf_parser.calculate_gpa(grades_dict)

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
        # Not sure if this should be gpa, result, or actual
        result = pdf_parser.calculate_gpa(grades_dict)

        # Assert
        self.assertEqual(4.0, result)

