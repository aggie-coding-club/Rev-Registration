from django.db import models

class Instructor(models.Model):
    """ Model that represents a professor, who may teach many courses """
    id = models.IntegerField(primary_key=True)
    email_address = models.CharField(max_length=320, null=True)
    name = models.CharField(max_length=64)

    class Meta:
        db_name = "instructors"
