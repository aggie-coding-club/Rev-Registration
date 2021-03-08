from django.db import models

class Term(models.Model):
    """ Represents a term """
    code = models.IntegerField(primary_key=True)
    last_updated = models.DateTimeField()

    class Meta:
        db_table = "terms"
