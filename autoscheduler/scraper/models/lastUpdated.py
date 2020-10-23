from django.db import models


class LastUpdated(models.Model):
    """ Model that represents the last time course information was scraped for a specific term """
    term = models.CharField(max_length=100, primary_key=True)
    date = models.CharField(max_length=30)

    class Meta:
        db_table = "lastUpdated"
