from rest_framework import serializers
from .models.course import Course
from .models.section import Section, Meeting
from .models.department import Department

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
            'start_time': meeting.start_time,
            'end_time': meeting.end_time,
            'type': meeting.meeting_type,
        } for meeting in meetings]

class TermSerializer(serializers.ModelSerializer):
    """ Serializes a term into an object with information needed by /api/terms """
    desc = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['term', 'desc']


    def get_desc(self, obj):
        """ Uses term field to generate description for the term in the
            form "Fall - College Station" format"""

        def season_num_to_string(season_num):
            """" Converts int representing season in 'term' field to a string to
                use in get_term """
            # put all translations here. Possibly inaccurate atm.
            seasons = {
                1: "Spring",
                2: "Summer",
                3: "Fall",
                4: "Winter",
            }
            return seasons.get(season_num, "NO SEASON")

        def campus_num_to_string(campus_num):
            """" Converts int representing campus in 'term' field to a string to
                use in get_term """
            # put all translations here. Possibly inaccurate atm.
            campus = {
                1: "College Station",
            }
            return campus.get(campus_num, "NO CAMPUS")

        season_string = season_num_to_string(int(obj.term[4]))
        campus_string = campus_num_to_string(int(obj.term[5]))
        year_string = obj.term[0:4] #takes digits that represent year from termcode
        desc = season_string + " " + year_string + " - " + campus_string

        return desc

class CourseSearchSerializer(serializers.ModelSerializer):
    """ Serializes a course into an an with information needed by /api/terms """
    course = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['course']

    def get_course(self, obj):
        """ Gets list of items in for dept course i.e CSCE 121"""
        return obj.dept + " " + obj.course_num
