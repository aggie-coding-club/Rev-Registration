from django.db import models

def generate_course_id(dept: str, course_num: str, term: str):
    """ Generates the course_id in the form of {dept}{course_num}-{term} """

    return "".join((dept, course_num, '-', term))

class Course(models.Model):
    """ Basic course model """

    id = models.CharField(max_length=14, primary_key=True) # Could be dept+course_num
    dept = models.CharField(max_length=4, db_index=True) # CSCE
    course_num = models.CharField(max_length=5, db_index=True) # i.e. 314
    title = models.CharField(max_length=100) # Course title, i.e. "Programming Languages"
    description = models.TextField(blank=True)
    core_curriculum = models.CharField(max_length=32, blank=True) # ex 'Creative Arts'
    credit_hours = models.FloatField(null=True) # Number of credit hours the course
    term = models.CharField(max_length=6,blank=True)#term code

    class Meta:
        db_table = "courses"
