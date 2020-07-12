from rest_framework.test import APITestCase
from django.contrib.sessions.models import Session

class CoursesAPITests(APITestCase):
    """ Tests functionality of the sessions api """
    def setUp(self):
        """ Delete sessions table and log in before each test to create a new session """
        Session.objects.all().delete()
        self.client.login()

    def test_save_courses_correctly_parses_empty_json(self):
        """ Tests that /sessions/save_courses doesn't throw an error when saving empty
            json
        """
        # Arrange
        expected = {}
        session = self.client.session
        term = '202031'
        session['term'] = term
        session.save()

        # Act
        response = self.client.put('/sessions/save_courses', expected, format='json')
        session = self.client.session

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(expected, session[term]['courses'])

    def test_save_courses_correctly_parses_course_data_json(self):
        """ Tests that /sessions/save_courses can parse a complicated json object.
            Note that this doesn't test anything related to the actual formatting:
            it should simply trust that the frontend gives it data that can it can
            later parse back into course card information.
        """
        # Arrange
        expected = {
            'array': [1, 2, 3],
            'boolean': True,
            'null': None,
            'nested': {
                'interior array': [None, 1, 'a'],
            },
        }
        session = self.client.session
        term = '202031'
        session['term'] = term
        session.save()

        # Act
        response = self.client.put('/sessions/save_courses', expected, format='json')
        session = self.client.session

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(expected, session[term]['courses'])

    def test_get_saved_courses_gives_error_with_no_term(self):
        """ Tests that /sessions/get_saved_courses doesn't allow requests with no term
        """
        # Arrange
        term = ''

        # Act
        response = self.client.get(f'/sessions/get_saved_courses?term={term}')

        # Assert
        self.assertNotEqual(response.status_code, 200)

    def test_get_saved_courses_defaults_with_no_courses_for_term(self):
        """ Tests that /sessions/get_saved_courses gives an empty JSON object when
            provided with a term that has no data
        """
        # Arrange
        expected = {}
        term = '202031'

        # Act
        response = self.client.get(f'/sessions/get_saved_courses?term={term}')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(expected, response.json())

    def test_get_saved_courses_gets_courses_for_term(self):
        """ Tests that /sessions/get_saved_courses gives a response equal to the original
            saved data when called
        """
        # Arrange
        expected = {
            'array': [1, 2, 3],
            'boolean': True,
            'null': None,
            'nested': {
                'interior array': [None, 1, 'a'],
            },
        }
        term = '202031'
        session = self.client.session
        session[term] = {'courses': expected}
        session.save()

        # Act
        response = self.client.get(f'/sessions/get_saved_courses?term={term}')

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(expected, response.json())
