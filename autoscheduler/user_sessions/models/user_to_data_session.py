from django.db import models
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import user_logged_in

class UserToDataSession(models.Model):
    """ Stores the id of a user and the session that holds their data """
    user_id = models.IntegerField()
    session_key = models.CharField(max_length=40)

    class Meta:
        db_table = "user_to_data_session"

def get_or_create_data_session(sender, request, user, **kwargs):
    """ Checks if the user already has a session assigned to them in which
        to store their data. If so, saves the session id of that session to
        their current session. Otherwise, creates a session for them, and a
        user_to_data_session entry that associates them with the session
        before saving that session id to their current session
    """
    user_id = user.id
    print("USER ID: " + str(user_id))
    temp_session = request.session
    print("TEMP Session Key: " + temp_session.session_key)
    try:
        # If the model exists store the data_session_key in the temp session
        user_to_data_session_model = UserToDataSession.objects.get(user_id=user_id)
        print("FOUND EXISITNG OBJECT")
        data_session_key = user_to_data_session_model.session_key
        print("DATA Session Key: " + data_session_key)
        temp_session['data_session_key'] = data_session_key
    except UserToDataSession.DoesNotExist:
        # Otherwise create the model before storing data_session_key in temp session
        print("NO OBJECT ALREADY EXISTS")
        print("CREATING DATA SESSION")
        # Create a session object
        data_session = SessionStore()
        data_session.create()
        data_session_key = data_session.session_key
        print("DATA Session Key: " + data_session_key)
        # Create a user_to_data_session entry
        user_to_data_session_model = UserToDataSession()
        user_to_data_session_model.session_key = data_session_key
        user_to_data_session_model.user_id = user_id
        user_to_data_session_model.save()
        # Store the data_session_key in the temp session
        data_session_key = user_to_data_session_model.session_key #kinda useless
        temp_session['data_session_key'] = data_session_key

user_logged_in.connect(get_or_create_data_session)
