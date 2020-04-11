import django.test

from scraper.tests.utils.load_json import load_json_file

from scraper.management.commands.scrape_depts import parse_departments
from scraper.models import Department

class ScrapeDepartmentTests(django.test.TestCase):
    """ Tests the scrape_depts Django command """
    def setUp(self):
        self.depts_input = load_json_file("../data/depts_input.json")

    def test_parse_departments_does_save_multiple_models(self):
        """ Tests if parse_departments saves the model to the database correctly
            Does so by calling parse_departments on the dept_input and queries for
            a matching Department model from the database
        """

        term = "202011"

        # Arrange
        csce_code = "CSCE"
        csce_desc = "CSCE - Computer Sci &amp; Engr"

        math_code = "MATH"
        math_desc = "MATH - Mathematics"

        # Act
        depts = parse_departments(self.depts_input, term)
        Department.objects.bulk_create(depts)

        # Assert
        # If these queries fails, it will through an error thus correctly failing the test
        Department.objects.get(code=csce_code, description=csce_desc, term=term)
        Department.objects.get(code=math_code, description=math_desc, term=term)

        assert True
