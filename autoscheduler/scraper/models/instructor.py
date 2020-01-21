from django.db import models

class Instructor(models.Model):
    """ Model that represents a professor, who may teach many courses """
    id = models.CharField(max_length=100, primary_key=True)
    email_address = models.CharField(max_length=48, null=True)

    class Meta:
        db_table = "instructors"
