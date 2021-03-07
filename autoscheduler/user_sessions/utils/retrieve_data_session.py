from datetime import datetime, timedelta, timezone
from contextlib import contextmanager
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.sessions.models import Session
from user_sessions.models import UserToDataSession

@contextmanager
def retrieve_data_session(request):
    """ Checks if the user already has a session assigned to them in which
        to store their data. If so, saves the session id of that session to
        their current session. Otherwise, creates a session for them, and a
        user_to_data_session entry that associates them with the session
        before saving that session id to their current session
    """
    # Get user id
    user_id = request.user.id
    # Session stuff
    try:
        if user_id is None:
        # The User is anonymous, uses request.session
            data_session = request.session
            yield data_session
        else:
        # If user is logged in and model exists, uses the session in the model
            session_key = UserToDataSession.objects.get(user_id=user_id).session_key
            session = Session.objects.get(pk=session_key)

            # Keep session unexpired (SessionStore doesn't work for expired sessions)
            now = datetime.now(tz=timezone.utc)
            if session.expire_date <= now:
                session.expire_date = now + timedelta(weeks=520)
                session.save()

            data_session = SessionStore(session_key=session_key)
            # Ensure a Session object exists matching the UserToDataSession
            yield data_session
    except (UserToDataSession.DoesNotExist, Session.DoesNotExist):
        # The user is logged in but a data session doesn't exist.
        # Create the model before returning the corresponding data session
        # Create a session object
        data_session = SessionStore()
        data_session.create()
        session_key = data_session.session_key
        # Copy data from session used before logging in to the data session.
        # This is to prevent user progress from being lost on their first login
        request_session_object = Session.objects.get(pk=request.session.session_key)
        data_session_object = Session.objects.get(pk=session_key)
        data_session_object.session_data = request_session_object.session_data
        data_session_object.save()
        # Create a user_to_data_session entry (deleting any that might already exist)
        UserToDataSession.objects.filter(user_id=user_id).delete()
        UserToDataSession(user_id=user_id, session_key=session_key).save()
        data_session = SessionStore(session_key=session_key)
        yield data_session
    finally:
        data_session.save()
