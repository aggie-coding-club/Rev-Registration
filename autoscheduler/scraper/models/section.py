from django.db import models

class Meeting(models.Model):
    """ Describe model here """

class Section(models.Model):
    """ Section will contain Meeting objects,
        which is why its placed below it
    """
