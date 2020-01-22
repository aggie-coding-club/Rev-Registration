""" Helper functions for the pdf parser """

LEN_HEADER_ROW = 38
LEN_OLD_HEADER_ROW = 37
LEN_SECTION_ROW = 20
LEN_COURSE_TOTAL_ROW = LEN_COLLEGE_TOTAL_ROW = LEN_DEPT_TOTAL_ROW = 19

def pdf_helper(row_text: str) -> (bool, int):
    """ This needs a better name

        Args:
            The current text for the pdf

        Returns:
            bool: whether this is an old header row or not
            int: how much the row index should increment, or -1 if this is a grades row
    """

    old_row_style = False
    count = -1

    if _is_old_header_row(row_text):
        old_row_style = True
        count = LEN_OLD_HEADER_ROW
    elif _is_header_row(row_text):
        count = LEN_HEADER_ROW
    elif _is_course_total_row(row_text):
        count = LEN_COURSE_TOTAL_ROW
    elif _is_dept_total_row(row_text):
        count = LEN_DEPT_TOTAL_ROW
    elif _is_college_total_row(row_text):
        count = LEN_COLLEGE_TOTAL_ROW

    return (old_row_style, count)

def _is_old_header_row(string: str) -> bool:
    """ Used to identify whether a row is a header row or not in PDFs
        before 2017.

        This is needed so we can parse pre-2017 grade reports in a different way.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a header row or not.
    """
    return string == "COLLEGE:"

def _is_header_row(string: str) -> bool:
    """ Used to identify whether a row is a header row or not in PDFs
        from or after 2017.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a header row or not.
    """
    return string == "SECTION"

def _is_course_total_row(string: str) -> bool:
    """ Used to identify whether a row is a course total row or not.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a course total row or not.
    """
    return string == "COURSE TOTAL:"

def _is_dept_total_row(string: str) -> bool:
    """ Used to identify whether a row is a department total row or not.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a department total row or not.
    """
    return string == "DEPARTMENT TOTAL:"

def _is_college_total_row(string: str) -> bool:
    """ Used to identify whether a row is a college total row or not.

        Args:
            string: The first element in the row
        Returns:
            Whether the row is a department total row or not.
    """
    return string == "COLLEGE TOTAL:"
