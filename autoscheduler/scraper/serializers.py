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
    meeting_times = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['instructor_gpa', 'honors_only', 'web_only', 'meeting_times']

    def get_meeting_times(self, obj):
        """ Get this section's meetings and return an array of their start/end times """
        section_id = obj.id
        meetings = Meeting.objects.filter(section__id=section_id)
        return [[meeting.start_time, meeting.end_time] for meeting in meetings]
