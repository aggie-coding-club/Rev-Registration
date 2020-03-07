from datetime import time
from rest_framework import serializers
from scraper.models import Course, Meeting, Section

def format_time(time_obj: time) -> str:
    """ Formats a time object to a string HH:MM, for use with section serializer """
    return '' if time_obj is None else time_obj.strftime('%H:%M')

class CourseSerializer(serializers.ModelSerializer):
    """ Serializes a course into an object with information needed by /api/course """
    class Meta:
        model = Course
        fields = ['title', 'credit_hours']

class SectionSerializer(serializers.ModelSerializer):
    """ Serializes a section into an object with information needed by /api/sections """
    instructor_name = serializers.SerializerMethodField()
    meetings = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['id', 'crn', 'instructor_name', 'honors', 'meetings',
                  'section_num', 'web']

    def get_instructor_name(self, obj): # pylint: disable=no-self-use
        """ Get the name (id) of this section's instructor.
            This function is used to compute the value of the instructor_name field.
        """
        return obj.instructor.id

    def get_meetings(self, obj): # pylint: disable=no-self-use
        """ Gets meeting information for this section
            This function is used to compute the value of the meetings field.
        """
        meetings = Meeting.objects.filter(section__id=obj.id)
        return [{
            'id': str(meeting.id),
            'days': meeting.meeting_days,
            'start_time': format_time(meeting.start_time),
            'end_time': format_time(meeting.end_time),
            'type': meeting.meeting_type,
        } for meeting in meetings]
