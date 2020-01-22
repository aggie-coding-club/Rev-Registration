from rest_framework import serializers
from .models.course import Course
from .models.section import Section, Meeting

class CourseSerializer(serializers.ModelSerializer):
    """ Serializes a course """
    class Meta:
        model = Course
        fields = ['title', 'credit_hours']

class SectionSerializer(serializers.ModelSerializer):
    """ Serializes a section """
    instructor_name = serializers.SerializerMethodField()
    meetings = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['crn', 'instructor_gpa', 'instructor_name', 'honors_only', 'meetings',
                  'section_num', 'web_only']

    def get_instructor_name(self, obj):
        """ Get the name (id) of this section's instructor """
        return obj.instructor.id

    def get_meetings(self, obj):
        """ Gets meeting information for this section """
        meetings = Meeting.objects.filter(section__id=obj.id)
        return {str(meeting.id): {
            'days': meeting.meeting_days,
            'start_time': meeting.start_time,
            'end_time': meeting.end_time,
            'type': meeting.meeting_type,
        } for meeting in meetings}
