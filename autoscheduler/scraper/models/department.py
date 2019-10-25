from django.db import models

class Department(models.Model):
    code = models.CharField(max_length=4, primary_key=True) # Ex: CSCE
    description = models.TextField(max_length=100) # Ex: CSCE - Computer Sci & Engr

    class Meta:
        db_table = "departments"
    