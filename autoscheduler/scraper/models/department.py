from django.db import models

def generate_department_id(code: str, term: str):
    """ Generates the department id as {code}-{term} """

    return "".join((code, '-', term))

class Department(models.Model):
    """ Data structure that stores the department tag and description """

    id = models.CharField(max_length=10, primary_key=True) # code + term
    code = models.CharField(max_length=4) # Ex: CSCE
    description = models.TextField(max_length=100) # Ex: CSCE - Computer Sci & Engr
    term = models.CharField(max_length=6, db_index=True)

    class Meta:
        db_table = "departments"
