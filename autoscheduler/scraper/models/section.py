"""Models for meetings and sections.
Together, they represent all the information for a particular meeting time.
"""
from django.contrib.postgres.fields import ArrayField
from django.db import models

class Section(models.Model):
    """ Section contains data for a group of meetings. """
    id = models.BigIntegerField(primary_key=True) # id is primary key in scraped data
    subject = models.CharField(max_length=4, db_index=True)
    course_num = models.CharField(max_length=5, db_index=True)
    section_num = models.CharField(max_length=4, db_index=True)
    term_code = models.IntegerField(db_index=True)
    min_credits = models.IntegerField() # Will never be null
    max_credits = models.IntegerField(null=True) # Will be null in most cases
    max_enrollment = models.IntegerField()
    current_enrollment = models.IntegerField()
    instructor = models.ForeignKey('Instructor', on_delete=models.CASCADE, null=True)

    class Meta:
        db_table = "sections"

def generate_meeting_id(section_id: str, meetings_count: str):
    """ Generates the meeting id in the form of {section_id}{meetings_count}"""

    return "".join((section_id, meetings_count))

class Meeting(models.Model):
    """ Describes a particular meeting time of a section.
        Each section has one or more meetings.
    """
    id = models.BigIntegerField(primary_key=True) # id is primary key in scraped data
    crn = models.IntegerField(db_index=True)
    building = models.CharField(max_length=5, null=True)
    meeting_days = ArrayField(models.BooleanField(), size=7)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    meeting_type = models.CharField(max_length=4) # Meeting types: LEC, LAB, REC, INS, etc
    section = models.ForeignKey(Section, on_delete=models.CASCADE)

    class Meta:
        db_table = "meetings"
