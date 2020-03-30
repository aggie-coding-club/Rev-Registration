from datetime import time
from rest_framework import serializers
from scraper.models import Course, Section, Meeting, Department, Grades

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

def season_num_to_string(season_num):
    """ Converts int representing season in 'term' field to a string to
        use in get_term
    """
    # Put all translations here. Possibly incomplete.
    seasons = {
        1: "Spring",
        2: "Summer",
        3: "Fall",
        4: "Full Yr Professional",
    }
    return seasons.get(season_num, "NO SEASON")

def campus_num_to_string(campus_num):
    """ Converts int representing campus in 'term' field to a string to
        use in get_term
    """
    # Put all translations here. Possibly incomplete.
    campus = {
        1: "College Station",
        2: "Galveston",
        3: "Qatar",
        5: "Half Year Term",
    }
    return campus.get(campus_num, "NO CAMPUS")

class TermSerializer(serializers.ModelSerializer):
    """ Serializes a department into an object with information needed by /api/terms """
    desc = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['term', 'desc']

    def get_desc(self, obj): # pylint: disable=no-self-use
        """ Uses term field to generate description for the term in the
            format "Fall - College Station"
        """
        year_string = obj.term[0:4] # Takes digits that represent year from termcode.
        season_string = season_num_to_string(int(obj.term[4]))
        if season_string == "Full Yr Professional":
            return f"{season_string} {year_string} - {int(year_string) + 1}"
        campus_string = campus_num_to_string(int(obj.term[5]))
        return f"{season_string} {year_string} - {campus_string}"

class CourseSearchSerializer(serializers.ModelSerializer):
    """ Serializes a course into an object with information needed
        by /api/course/search
    """
    course = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['course']

    def get_course(self, obj): # pylint: disable=no-self-use
        """ Gets list of items in for dept course i.e CSCE 121 """
        return f"{obj.dept} {obj.course_num}"

class GradeSerializer(serializers.ModelSerializer):
    # This takes counts and avg GPA of all courses for the instructor combined
    """ Serializes a grades for a section into an object with information needed
        by /api/grades
    """
    grades = serializers.SerializerMethodField()
    class Meta:
        model = Grades
        fields = ['grades']
    def get_grades(self, obj): # pylint: disable=no-self-use
        """ Retrieves the dictionary object to be serialized """
        return obj
