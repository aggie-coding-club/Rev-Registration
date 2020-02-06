from rest_framework import serializers
from .models.course import Course
from .models.section import Section, Meeting

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

    # Used to get value for instructor_name field
    def get_instructor_name(self, obj):
        """ Get the name (id) of this section's instructor """
        return obj.instructor.id

    # Used to get value for meetings field
    def get_meetings(self, obj):
        """ Gets meeting information for this section """
        meetings = Meeting.objects.filter(section__id=obj.id)
        return [{
            'id': str(meeting.id),
            'days': meeting.meeting_days,
            'start_time': meeting.start_time,
            'end_time': meeting.end_time,
            'type': meeting.meeting_type,
        } for meeting in meetings]
