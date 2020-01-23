""" (Modified) From Gabriel Britain's Good Bull Scheduler """

from scraper.management.commands.utils.pdf_helper import get_pdf_skip_count
from typing import Dict, List, Tuple
import datetime
import re
from dataclasses import dataclass

import PyPDF2

LEN_SECTION_ROW = 20
LETTERS = ["A", "B", "C", "D", "F", "I", "S", "U", "Q", "X"]

@dataclass # This automatically adds a constructor so we don't have to
class GradeData():
    """ The collection of grades for a particular section """
    dept: str
    course_num: str
    section_num: str
    letter_grades: Dict
    gpa: float

def sanitize_page(page_obj: PyPDF2.pdf.PageObject) -> List[str]:
    """ Splits a PageObject's content on any number of newlines, and returns
        the content as a list of strings.

        Args:
            page_obj: The content of a PDF page
        Returns:
            A list of strings representing the content on the page.
    """
    text = page_obj.extractText()
    text = re.split(r"\n+", text)
    return [t.strip() for t in text]

def extract_letter_grades(section_row: List[str], old_pdf_style: bool) -> Dict[str, int]:
    """ Something

        Args:
            section_row: The current text for this row
            old_pdf_style: Whether this is the old pdf style (pre-2017)
        Returns:
            A dictionary of letter grades, with the key as the letter and the value as
            the grade
    """

    ABCDF_SLICE = slice(1, 10, 2)
    ISUQX_SLICE = slice(13, 18)
    if old_pdf_style: # Old pdfs are arranged differently
        ABCDF_SLICE = slice(4, 9)
        ISUQX_SLICE = slice(10, 15)

    letter_grades = section_row[ABCDF_SLICE] + section_row[ISUQX_SLICE]
    letter_grades = {
        l: int(grade) for l, grade in zip(LETTERS, letter_grades)
    }

    return letter_grades


def parse_page(
    page_obj: PyPDF2.pdf.PageObject # FIXME I don't like this rule
) -> List[GradeData]:
    """ Parses a single page of a PDF, extracting a list of grade data for each section.

        Args:
            page_obj: A PyPDF2.pdf.PageObject representing the current page
        Returns:
            A list of GradeData objects, with the GPA as None
    """

    text = sanitize_page(page_obj) # Splits the text into separate lines
    i = 0 # The current row in the pdf we're on
    grade_data = [] # list of GradeData objects

    while i < len(text):
        skip_count = get_pdf_skip_count(text[i])
        old_pdf_style = skip_count[0]
        count = skip_count[1] # The actual count of how many rows should be skipped

        if count != -1:
            i += count
        else: # FIXME Are these the only rows we care about
            # Basically split the row by sections
            section_row = text[i : i + LEN_SECTION_ROW]
            try:
                dept, course_num, section_num = section_row[0].split("-")

                letter_grades = extract_letter_grades(section_row, old_pdf_style)

                grade = GradeData(dept, course_num, section_num, letter_grades, None)

                grade_data.append(grade)

                i += LEN_SECTION_ROW
            except ValueError: # When would this happen? What causes it?
                i += LEN_SECTION_ROW - 1

    return grade_data

def calculate_gpa(letter_grades: Dict) -> float:
    """ Given a series of letter grades, calculates the GPA of the section.

        Args:
            letter_grades: A list of integers representing how many students got
                            each letter grade
        Returns:
            The calculated gpa.
    """
    A = 4.0
    B = 3.0
    C = 2.0
    D = 1.0
    F = 0.0
    WEIGHTS = [A, B, C, D, F]
    grades = [letter_grades[char] for char in ["A", "B", "C", "D", "F"]]
    num_students = sum(grades)

    gpa = 0.0
    for students_with_grade, weight in zip(grades, WEIGHTS):
        gpa += students_with_grade * weight
    return gpa / num_students

def parse_pdf(pdf_path: str) -> List[GradeData]:
    """ Loads the pdf from the given path and calls parse_page on each page, then collects
        the results into one array.

        Args:
            pdf_path: The path to the pdf
        Returns:
            A list of GradeData, with each GPA calculated
    """

    with open(pdf_path, "rb") as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        pdf_data = []

        # Iterate through all pdf pages
        for i in range(pdf_reader.getNumPages()): 
            # Parse the individual page
            page_data = parse_page(pdf_reader.getPage(i))

            # Calculate the GPA for each grade distribution
            for grade in page_data:
                grade.gpa = calculate_gpa(grade.letter_grades)

        return pdf_data
