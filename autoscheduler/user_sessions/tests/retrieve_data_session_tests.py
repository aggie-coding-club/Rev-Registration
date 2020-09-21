import django.test

from django.contrib.sessions.models import Session
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth.models import User, AnonymousUser
from user_sessions.models.user_to_data_session import UserToDataSession
from user_sessions.utils.retrieve_data_session import retrieve_data_session

class RetrieveDataSessionTests(django.test.TestCase):
    """ Tests the functionality of the retrieve_data_session context
        manager.
    """

    def setUp(self):
        """ Delete sessions, user, and user_to_data_session table before each test.
            Also resets the request factory that mocks requests.
            This is to prevent cross test contamination.
        """
        User.objects.all().delete()
        Session.objects.all().delete()
        UserToDataSession.objects.all().delete()
        self.factory = django.test.RequestFactory()

    def test_creates_entry_in_user_to_data_session_table_for_new_logged_in_user(self):
        """ Checks that retrieve_data_session creates an entry in user_to_data_session
            table for the user if the user does not already have one
        """
        # Arrange
        request = self.factory.get("SOME URL")
        new_user = User.objects.create_user(username="new_user")
        request.user = new_user
        user_id = request.user.id
        # Act
        with retrieve_data_session(request):
        # Assert
            self.assertTrue(UserToDataSession.objects.filter(user_id=user_id).exists())

    def test_no_entry_created_in_user_to_data_session_table_for_existing_user(self):
        """ Checks that retrieve_data_session does not create another entry in
            user_to_data_session table if the logged in user already has one
        """
        #Arrange
        expected_rows = 1

        request = self.factory.get("SOME URL")
        existing_user = User.objects.create_user(username="existing_user")
        existing_user_data_session = SessionStore()
        existing_user_data_session.create()
        request.user = existing_user
        user_id = request.user.id
        session_key = existing_user_data_session.session_key
        existing_entry = UserToDataSession(id=0, user_id=user_id, session_key=session_key)
        existing_entry.save()
        # Act
        with retrieve_data_session(request):
            actual_rows = UserToDataSession.objects.filter(user_id=user_id).count()
        # Assert
            self.assertEqual(expected_rows, actual_rows)

    def test_returns_correct_session_for_existing_user(self):
        """ Checks that retrieve_data_session returns the session corresponding to
            the existing user_to_data_session table entry for the user
        """
        #Arrange
        request = self.factory.get("SOME URL")
        existing_user = User.objects.create_user(username="existing_user")
        existing_user_data_session = SessionStore()
        existing_user_data_session.create()
        request.user = existing_user
        user_id = request.user.id
        session_key = existing_user_data_session.session_key
        existing_entry = UserToDataSession(id=0, user_id=user_id, session_key=session_key)
        existing_entry.save()

        expected_key = existing_user_data_session.session_key
        # Act
        with retrieve_data_session(request) as data_session:
            actual_key = data_session.session_key
        # Assert
            self.assertEqual(expected_key, actual_key)

    def test_no_entry_created_in_user_to_data_session_table_for_logged_out_user(self):
        """ Checks that retrieve_data_session does not create an
            entry in user_to_data_session table if the the user is
            not logged in
        """
        # Arrange
        expected_rows = 0

        request = self.factory.get("SOME URL")
        logged_out_user = AnonymousUser()
        request.user = logged_out_user
        request.session = SessionStore()
        # Act
        with retrieve_data_session(request):
            actual_rows = UserToDataSession.objects.count()
        # Assert
            self.assertEqual(expected_rows, actual_rows)

    def test_returns_correct_session_for_logged_out_user(self):
        """ Checks that retrieve_data_session returns the request.session for logged
            out users.
        """
        # Arrange
        request = self.factory.get("SOME URL")
        logged_out_user = AnonymousUser()
        request.user = logged_out_user
        request.session = SessionStore()
        request.session.create()

        expected_key = request.session.session_key
        # Act
        with retrieve_data_session(request) as data_session:
            actual_key = data_session.session_key
        # Assert
            self.assertEqual(expected_key, actual_key)
