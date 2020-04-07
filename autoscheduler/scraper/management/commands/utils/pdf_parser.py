""" (Modified) From Gabriel Britain's Good Bull Scheduler """

from typing import Dict, List
import re
from dataclasses import dataclass

import PyPDF2

from scraper.management.commands.utils.pdf_helper import get_pdf_skip_count

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
    """ Maps the according section_row text to a dict w/ the respective letter grades &
        how many people received that grade

        Args:
            section_row: The current text for this row
            old_pdf_style: Whether this is the old pdf style (pre-2016 Fall)
        Returns:
            A dictionary of letter grades, with the key as the letter and the count of how
            many people received that letter grade
    """

    abcdf_slice = slice(1, 10, 2)
    isuqx_slice = slice(13, 18)
    if old_pdf_style: # Old pdfs are arranged differently
        abcdf_slice = slice(4, 9)
        isuqx_slice = slice(10, 15)

    letter_grades = section_row[abcdf_slice] + section_row[isuqx_slice]
    letter_grades = {
        l: int(grade) # Map each letter to the respective amount of grad
        for l, grade in zip(LETTERS, letter_grades)
    }

    return letter_grades

def parse_page(page_obj: PyPDF2.pdf.PageObject) -> List[GradeData]:
    """ Parses a single page of a PDF, extracting a list of grade data for each section.

        Args:
            page_obj: A PyPDF2.pdf.PageObject representing the current page
        Returns:
            A list of GradeData objects, with the GPA as None
    """

    text = sanitize_page(page_obj) # Splits the text into separate lines
    i = 0 # The current row in the pdf we're on
    grade_data = [] # list of GradeData objects

    old_pdf_style = False
    while i < len(text):
        row_is_old_pdf, count = get_pdf_skip_count(text[i])

        # If any of the rows indicate that it's an old PDF style, then this whole
        # page is an old pdf, and each section's grades needs to use the old style
        if row_is_old_pdf:
            old_pdf_style = True

        if count != -1:
            i += count
        else: # These are the rows that have actual grade data on them
            # Split the row into separate sections
            section_row = text[i : i + LEN_SECTION_ROW]
            try:
                dept, course_num, section_num = section_row[0].split("-")

                letter_grades = extract_letter_grades(section_row, old_pdf_style)

                grade = GradeData(dept, course_num, section_num, letter_grades, None)

                grade_data.append(grade)

                i += LEN_SECTION_ROW
            except ValueError:
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
    weights = [4.0, 3.0, 2.0, 1.0, 0.0] # A to F GPAs, respectively
    grades = [letter_grades[char] for char in ["A", "B", "C", "D", "F"]]

    num_students = 0
    gpa = 0.0
    for students_with_grade, weight in zip(grades, weights):
        gpa += students_with_grade * weight
        num_students += students_with_grade

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
        for i in range(pdf_reader.numPages):
            # Parse the individual page
            page_data = parse_page(pdf_reader.getPage(i))

            # Calculate the GPA for each grade distribution
            for grade in page_data:
                grade.gpa = calculate_gpa(grade.letter_grades)

            # Add this page's data to the list of GradeData to be returned
            pdf_data.extend(page_data)

        return pdf_data
