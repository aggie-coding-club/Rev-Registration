"""Models for meetings and sections.
Together, they represent all the information for a particular meeting time.
"""

from django.contrib.postgres.fields import ArrayField
from django.db import models
from scraper.models import Instructor

class Section(models.Model):
    """ Section contains data for a group of meetings.
    """
    id = models.IntegerField(primary_key=True) # id is primary key in scraped data
    subject = models.CharField(max_length=4, db_index=True)
    course_num = models.IntegerField(db_index=True)
    section_num = models.IntegerField(db_index=True)
    term_code = models.IntegerField(db_index=True)
    min_credits = models.IntegerField()
    max_credits = models.IntegerField(null=True) #min_credits is never null, but max_credits can be
    max_enrollment = models.IntegerField()
    current_enrollment = models.IntegerField()
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)

    class Meta:
        db_table = "sections"

class Meeting(models.Model):
    """Describes a particular meeting time of a section.
    Each section has one or more meetings.
    """
    id = models.IntegerField(primary_key=True) # id is primary key in scraped data
    crn = models.IntegerField(db_index=True) # We'll probably going to be searching for CRNs a lot
    building = models.CharField(max_length=4, null=True) # Online/research meetings have no building
    meeting_days = ArrayField(
        models.BooleanField(),
        size=7
    )
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    meeting_type = models.CharField(max_length=3) #Meeting types: LEC, LAB, RES, INS
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    class Meta:
        db_table = "meetings"
