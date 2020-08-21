from rest_framework.test import APITestCase
from django.contrib.sessions.models import Session
from django.contrib.auth.models import User

class IsLoggedInAPITests(APITestCase):
    """ Tests the functionality of the get_is_logged_in API """
    def setUp(self):
        """ Delete sessions table before each test to ensure new session """
        Session.objects.all().delete()

    def test_return_true_when_user_logged_in(self):
        """ Tests that /sessions/get_is_logged_in response is true if
            user is logged in
        """
        #Arrange
        username = 'user_bob'
        password = 'password_bob'
        user = User.objects.create(username=username, first_name='Bob',
                                   last_name='Bobbins')
        user.set_password(password)
        user.save()

        expected_login_status = True
        expected = {'isLoggedIn': expected_login_status}

        #Act
        self.client.login(username=username, password=password)
        response = self.client.get(f'/sessions/get_is_logged_in')

        #Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)

    def test_return_false_when_user_logged_out(self):
        """ Tests that /sessions/get_is_logged_in response is false if
            user is logged out
        """
        #Arrange
        #no user to create/log in becuase testing logged out response

        expected_login_status = False
        expected = {'isLoggedIn': expected_login_status}

        #Act
        response = self.client.get(f'/sessions/get_is_logged_in')

        #Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected)
