from django.db import models

class UserToDataSession(models.Model):
    """ Stores the id of a user and the session that holds their data """
    user_id = models.IntegerField()
    session_key = models.CharField(max_length=40)

    class Meta:
        db_table = "user_to_data_session"
