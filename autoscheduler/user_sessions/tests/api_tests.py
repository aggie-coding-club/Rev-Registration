from rest_framework.test import APITestCase
from django.contrib.sessions.models import Session

class APITests(APITestCase):
    """ Tests functionality of the sessions api """
    def tearDown(self):
        """ Delete sessions table after each test so logging in creates a new session """
        Session.objects.all().delete()

    def test_set_last_term_gives_valid_response_non_empty(self):
        """ Tests that /sessions/set_last_term updates correctly
            with a valid term code
        """
        # Arrange
        expected_term = '202031'
        # login() is necessary for test client to use sessions
        self.client.login()

        # Act
        response = self.client.put(f'/sessions/set_last_term?term={expected_term}')
        session = self.client.session

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(session['term'], expected_term)

    def test_set_last_term_gives_valid_response_empty(self):
        """ Tests that /sessions/set_last_term updates correctly
            with an empty string as the term
        """
        # Arrange
        expected_term = ''
        # login() is necessary for test client to use sessions
        self.client.login()

        # Act
        response = self.client.put(f'/sessions/set_last_term?term={expected_term}')
        session = self.client.session

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(session['term'], expected_term)

    def test_set_last_term_rejects_no_term(self):
        """ Tests that /sessions/set_last_term rejects a call with no term specified
        """
        # Arrange
        # login() is necessary for test client to use sessions
        self.client.login()

        # Act
        response = self.client.put(f'/sessions/set_last_term')

        # Assert
        self.assertNotEqual(response.status_code, 200)

    def test_get_last_term_defaults_when_not_set(self):
        """ Tests that /sessions/get_last_term response defaults to empty string
            when it has not been set
        """
        # Arrange
        expected = {'term': ''}
        # login() is necessary for test client to use sessions
        self.client.login()

        # Act
        response = self.client.get(f'/sessions/get_last_term')

        # Assert
        self.assertEqual(response.json(), expected)

    def test_get_last_term_returns_correct_value(self):
        """ Tests that /sessions/get_last_term response is equal to the session's term """
        # Arrange
        expected_term = '202031'
        expected = {'term': expected_term}
        # login() is necessary for test client to use sessions
        self.client.login()
        session = self.client.session

        # Act
        session['term'] = expected_term
        session.save()
        response = self.client.get(f'/sessions/get_last_term')

        # Assert
        self.assertEqual(response.json(), expected)
