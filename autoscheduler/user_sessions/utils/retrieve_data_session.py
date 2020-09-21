from contextlib import contextmanager
from django.contrib.sessions.backends.db import SessionStore
from user_sessions.models import UserToDataSession

@contextmanager
def retrieve_data_session(request):
    """ Checks if the user already has a session assigned to them in which
        to store their data. If so, saves the session id of that session to
        their current session. Otherwise, creates a session for them, and a
        user_to_data_session entry that associates them with the session
        before saving that session id to their current session
    """
    # Get user
    user = request.user
    user_id = user.id
    # Session stuff
    try:
        if user_id is None:
        # The User is not logged in, uses request.session
            data_session_object = request.session
            yield request.session
        else:
        # If user is logged in and model exists, uses the session in the model
            user_to_data_session_model = UserToDataSession.objects.get(user_id=user_id)
            data_session_key = user_to_data_session_model.session_key
            data_session_object = SessionStore(session_key=data_session_key)
            yield data_session_object
    except UserToDataSession.DoesNotExist:
    # The user is logged in but the model doesn't exist.
    # Create the model before returning the corresponding data session
        # Create a session object
        data_session_object = SessionStore()
        data_session_object.create()
        data_session_key = data_session_object.session_key
        # Create a user_to_data_session entry
        user_to_data_session_model = UserToDataSession()
        user_to_data_session_model.session_key = data_session_key
        user_to_data_session_model.user_id = user_id
        user_to_data_session_model.save()
        # return the data session
        yield data_session_object
    finally:
        data_session_object.save()
