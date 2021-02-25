from datetime import datetime
from django.utils import timezone
from rest_framework.test import APITestCase
from scraper.models import Term

class LastUpdatedTests(APITestCase):
    """ Tests api/get_last_updated """

    def test_no_term_argument_gives_400_error(self):
        """ Tests that api/get_last_updated returns a 400 error when the term isn't
            provided
        """
        # Act
        response = self.client.get('/api/get_last_updated')

        # Assert
        self.assertEqual(response.status_code, 400)

    def test_no_term_exists_returns_none(self):
        """ Tests that api/get_last_updated returns undefined (None/null) when it
            attemps to get the date for a term that doesn't have a date for it
        """
        # Act
        response = self.client.get('/api/get_last_updated?term=202031')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, None)

    def test_term_exists_returns_date(self):
        """ Tests that api/get_last_updated returns the correct last_updated date
            when given the corresponding term
        """
        # Arrange
        expected = timezone.make_aware(datetime(2020, 1, 1))

        code = '202031'
        Term(code=code, last_updated=expected).save()

        # Act
        response = self.client.get(f'/api/get_last_updated?term={code}')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected)
