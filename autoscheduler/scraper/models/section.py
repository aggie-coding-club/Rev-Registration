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
    crn = models.IntegerField(db_index=True, default=0)
    min_credits = models.IntegerField() # Will never be null
    max_credits = models.IntegerField(null=True) # Will be null in most cases

    honors = models.BooleanField(null=True, db_index=True)
    remote = models.BooleanField(null=True, db_index=True)
    # A course is asynchronous if none of its meetings have meeting times
    asynchronous = models.BooleanField(db_index=True)

    max_enrollment = models.IntegerField()
    current_enrollment = models.IntegerField()
    instructor = models.ForeignKey('Instructor', on_delete=models.CASCADE, null=True)

    # Normal instructional methods
    F2F = 'F2F'
    INTERNSHIP = 'INTERN'
    NONTRADITIONAL = 'NOTRAD'
    WEB_BASED = 'WEB'
    STUDY_ABROAD = 'ABROAD'
    NONE = ''
    # Coronavirus instructional methods
    REMOTE = 'REMOTE'
    F2F_REMOTE_OPTION = 'F2FRO'
    MIXED_F2F_REMOTE = 'MIXED'

    INSTRUCTIONAL_METHOD_CHOICES = [
        (F2F, 'Face to Face'),
        (INTERNSHIP, 'Internship'),
        (NONTRADITIONAL, 'Non-traditional'),
        (WEB_BASED, 'Web Based'),
        (STUDY_ABROAD, 'Study abroad'),
        (NONE, ''),
        (REMOTE, 'Remote Only'),
        (F2F_REMOTE_OPTION, 'F2F or Remote'),
        (MIXED_F2F_REMOTE, 'Mixed, F2F and Remote'),
    ]

    instructional_method = models.CharField(max_length=6,
                                            choices=INSTRUCTIONAL_METHOD_CHOICES,
                                            blank=True,
                                            db_index=True)

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
    building = models.CharField(max_length=6, null=True)
    room = models.CharField(max_length=7, null=True)
    # meeting_days[0] is Monday, meeting_days[6] is Sunday
    meeting_days = ArrayField(models.BooleanField(), size=7)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    meeting_type = models.CharField(max_length=4) # Meeting types: LEC, LAB, REC, INS, etc
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='meetings'
    )

    class Meta:
        db_table = "meetings"
