""" (Modified) From Gabriel Britain's Good Bull Scheduler
    TODO: Rename the utils folder to something more applicable
"""

from typing import Dict, List, Tuple
import datetime
import re
from dataclasses import dataclass

import PyPDF2

LEN_HEADER_ROW = 38
LEN_OLD_HEADER_ROW = 37
LEN_SECTION_ROW = 20
LEN_COURSE_TOTAL_ROW = LEN_COLLEGE_TOTAL_ROW = LEN_DEPT_TOTAL_ROW = 19

LETTERS = ["A", "B", "C", "D", "F", "I", "S", "U", "Q", "X"]

@dataclass
class GradeData(): # Make this a named tuple? Or make this an @dataclass
    """ The collection of grades for a particular section """
    # Do I have to explicitly define these?
    dept: str
    course_num: str
    section_num: str
    letter_grades: Dict

    """
    def __init__(self, letter_grades: Dict, dept: str, course_num: str, section_num: str):
        FIXME

            Args:
                letter_grades: Dictionary of FIXME
                dept: Department such as CSCE

        self.letter_grades = letter_grades
        self.dept = dept
        self.course_num = course_num
        self.section_num = section_num
    """

def generate_year_semesters(): # Unused?
    """ Generator function. Generates year_semesters.

        Yields:
            YEAR + SEMESTER CODE
    """
    year = datetime.datetime.now().year
    # I think these are fine, maybe ignore it for the line?
    SPRING, SUMMER, FALL = 1, 2, 3
    while year >= 2013:
        for semester in (SPRING, SUMMER, FALL):
            yield str(year) + str(semester)
        year -= 1

def is_header_row(string: str) -> bool:
    """ Used to identify whether a row is a header row or not in PDFs
        from or after 2017.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a header row or not.
    """
    return string == "SECTION"

def is_old_header_row(string: str) -> bool:
    """ Used to identify whether a row is a header row or not in PDFs
        before 2017.

        This is needed so we can parse pre-2017 grade reports in a different way.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a header row or not.
    """
    return string == "COLLEGE:"

def is_course_total_row(string: str) -> bool:
    """ Used to identify whether a row is a course total row or not.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a course total row or not.
    """
    return string == "COURSE TOTAL:"

def is_dept_total_row(string: str) -> bool:
    """ Used to identify whether a row is a department total row or not.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a department total row or not.
    """
    return string == "DEPARTMENT TOTAL:"

def is_college_total_row(string: str) -> bool:
    """ Used to identify whether a row is a college total row or not.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a department total row or not.
    """
    return string == "COLLEGE TOTAL:"

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


def parse_page(
    page_obj: PyPDF2.pdf.PageObject # FIXME I don't like this rule
) -> List[Tuple[Dict, Tuple[str, str, str]]]:
    """ Parses a page from a PDF, extracting a list of grade data for each section.

        Args:
            page_obj: A PyPDF2.pdf.PageObject representing the current page
        Returns:
            A list of GradeData (FIXME see type definition at the top of the file).
    """

    # FIXME Add comments is this function

    # Rename this to page_text?
    text = sanitize_page(page_obj) # Splits the text into separate lines
    i = 0 # Is this the row we're on?
    grade_data = []
    old_pdf_style = False
    while i < len(text):
        print(text[i])
        # TODO I'd like to extract this if-block out
        if is_header_row(text[i]):
            i += LEN_HEADER_ROW
        elif is_old_header_row(text[i]):
            i += LEN_OLD_HEADER_ROW
            old_pdf_style = True
        elif is_course_total_row(text[i]):
            i += LEN_COURSE_TOTAL_ROW
        elif is_dept_total_row(text[i]):
            i += LEN_DEPT_TOTAL_ROW
        elif is_college_total_row(text[i]):
            i += LEN_COLLEGE_TOTAL_ROW
        else: # Are these the only rows we care about
            section_row = text[i : i + LEN_SECTION_ROW]
            try:
                dept, course_num, section_num = section_row[0].split("-")
                ABCDF_SLICE = slice(1, 10, 2)
                ISUQX_SLICE = slice(13, 18)
                if old_pdf_style: # Old pdfs are arranged differently?
                    ABCDF_SLICE = slice(4, 9)
                    ISUQX_SLICE = slice(10, 15)

                letter_grades = section_row[ABCDF_SLICE] + section_row[ISUQX_SLICE]
                letter_grades = { # what is this
                    l: int(grade) for l, grade in zip(LETTERS, letter_grades)
                }
                grade_data.append((letter_grades, (dept, course_num, section_num)))

                i += LEN_SECTION_ROW
            except ValueError: # When would this happen?
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

def parse_pdf(pdf_path: str) -> List[Tuple[Dict, Tuple[str, str, str], float]]:
    """ FIXME: Add documentation for this
        Need to describe what the return is
    """
    with open(pdf_path, "rb") as f:
        # FIXME: Add comments here
        pdf_reader = PyPDF2.PdfFileReader(f)
        pdf_data = []

        for i in range(pdf_reader.getNumPages()): # Iterate through all pdf pages
            # Parse the individual page
            page_data = parse_page(pdf_reader.getPage(i))

            for letter_grades, section_tuple in page_data:
                gpa = calculate_gpa(letter_grades)
                datatuple = (letter_grades, section_tuple, gpa)
                pdf_data.append(datatuple)
        return pdf_data
