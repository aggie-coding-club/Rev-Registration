from django.db import models

class Course(models.Model): 
    id = models.CharField(max_length=10, primary_key=True) # Could be dept+course_num
    dept = models.CharField(max_length=4, db_index=True) # CSCE
    course_num = models.CharField(max_length=5, db_index=True) # i.e. 221
    title = models.CharField(max_length=100) # Course title, i.e. "Data Structres & Algorithms"
    description = models.TextField(blank=True)
    prerequisites = models.TextField(blank=True)
    corequisites = models.TextField(blank=True)
    cd = models.BooleanField() # states whether course is a cd credit
    icd = models.BooleanField() # states whether course is an icd credit
    core_curriculum = models.CharField(max_length=32, blank=True) # ex 'Creative Arts'Blank for NA
    credit_hours = models.FloatField(null=True) # Number of credit hours the course is worth

    class Meta:
        db_table = "courses"
