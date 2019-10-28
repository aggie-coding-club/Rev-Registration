from django.db import models

class Course(models.Model): # Directly from GBS:w
    id = models.CharField(max_length=10, primary_key=True) # Could be dept+course_num
    dept = models.CharField(max_length=4, db_index=True) # CSCE
    course_num = models.CharField(max_length=5, db_index=True) # i.e. 221
    title = models.CharField(max_length=100) # Course title, i.e. "Data Structres & Algorithms"
    description = models.TextField(null=True, blank=True)
    prerequisites = models.TextField(null=True, blank=True)
    corequisites = models.TextField(null=True, blank=True)
    cd = models.CharField(max_length=3)#yes or no. states whether course is a cd credit
    icd = models.CharField(max_length=3)#yes or no. states whether course is an icd credit
    core_curriculum = models.CharField(max_length=32)#tag specifying what it counts as ex) 'Creative Arts' or 'American History'. If not a core curriculum class it can be blank or 'NA' or something
    credit_hours = models.FloatField(null = True)#Number of credit hours the course is worth. I didn't really see a point in the min/max credits because I've yet to see the same course with variable credit hours in the same semester (probably because I'm a freshman though).
    # distribution_of_hours = models.CharField(max_length=100) No idea what this is supposed to be but i left it as a comment. Explanation apprecitated. If this is a list of times the course meets I feel it's kind of redundant putting it here because that information will be in section

    class Meta:
        db_table = "courses"