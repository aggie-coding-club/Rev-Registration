import django.test

from django.contrib.sessions.models import Session
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth.models import User, AnonymousUser # pylint: disable=imported-auth-user
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
        request.session = SessionStore()
        request.session.create()
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
        SessionStore(session_key=session_key).save()
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

    def test_returns_correct_session_for_anonymous_user(self):
        """ Checks that retrieve_data_session returns the request.session
            for anonymous users.
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

    def test_request_session_data_is_copied_to_data_session_on_first_login(self):
        """ Checks that retrieve_data_session copies the data from the anonymous
            session, request.session, to the data session created for a user when
            they first log in.
        """
        # Arrange
        request = self.factory.get("SOME URL")
        new_user = User.objects.create_user(username="new_user")
        request.user = new_user
        request.session = SessionStore()
        request.session.create()
        # Act
        request.session['yeet'] = 1515
        request.session.save()
        request_session_object = Session.objects.get(pk=request.session.session_key)
        with retrieve_data_session(request) as session:
            session_object = Session.objects.get(pk=session.session_key)
        # Assert
            self.assertEqual(session_object.get_decoded(),
                             request_session_object.get_decoded())

    def test_new_session_created_when_user_data_session_is_invalid(self):
        """ Checks that if the Session object for a UserToDataSession is not in the
            database, a new session is created to allow the user to make new requests.
        """
        # Arrange
        request = self.factory.get("SOME URL")
        request.session = SessionStore()
        request.session.create()

        existing_user = User.objects.create_user(username="existing_user")
        existing_user_data_session = SessionStore()
        existing_user_data_session.create()
        request.user = existing_user
        user_id = request.user.id
        session_key = existing_user_data_session.session_key
        SessionStore(session_key=session_key).save()
        existing_entry = UserToDataSession(id=0, user_id=user_id, session_key=session_key)
        existing_entry.save()

        # Delete session object for UserToDataSession
        Session.objects.get(pk=session_key).delete()
        original_key = existing_user_data_session.session_key

        # Act
        with retrieve_data_session(request) as data_session:
            actual_key = data_session.session_key

        # Assert
        self.assertNotEqual(original_key, actual_key)
        self.assertIsNotNone(Session.objects.get(pk=actual_key))
