from datetime import time
from rest_framework import serializers
from scraper.models import Course, Section, Department, Grades, Term

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
    grades = serializers.SerializerMethodField()
    instructional_method = serializers.CharField(
        source='get_instructional_method_display'
    )

    class Meta:
        model = Section
        fields = ['id', 'crn', 'subject', 'course_num', 'section_num', 'remote', 'honors',
                  'meetings', 'instructor_name', 'min_credits', 'max_credits',
                  'current_enrollment', 'max_enrollment', 'grades', 'asynchronous',
                  'instructional_method']

    def get_instructor_name(self, section): # pylint: disable=no-self-use
        """ Get the name (id) of this section's instructor.
            This function is used to compute the value of the instructor_name field.
        """
        return section.instructor.id if section.instructor else 'TBA'

    def get_meetings(self, section): # pylint: disable=no-self-use
        """ Gets meeting information for this section
            This function is used to compute the value of the meetings field.
        """
        return [{
            'id': str(meeting.id),
            'building': meeting.building,
            'days': meeting.meeting_days,
            'start_time': format_time(meeting.start_time),
            'end_time': format_time(meeting.end_time),
            'type': meeting.meeting_type,
        } for meeting in section.meetings.all()]

    def get_grades(self, section): # pylint: disable=no-self-use
        """ Gets the past grade distributions for this prof + course """
        skip_grades = self.context.get('skip_grades')
        if skip_grades:
            return None

        grades = Grades.objects.instructor_performance(
            section.subject,
            section.course_num,
            section.instructor,
            section.honors
        )
        # If GPA is none, then there weren't any grades for this course & professor
        if grades.get("gpa") is None or section.instructor is None:
            return None

        return grades

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
    code = serializers.SerializerMethodField()

    class Meta:
        model = Term
        fields = ['code', 'desc']

    def get_desc(self, obj): # pylint: disable=no-self-use
        """ Uses term field to generate description for the term in the
            format "Fall - College Station"
        """
        code_str = str(obj.code)

        year_string = code_str[0:4] # Takes digits that represent year from termcode.
        season_string = season_num_to_string(int(code_str[4]))
        if season_string == "Full Yr Professional":
            return f"{season_string} {year_string} - {int(year_string) + 1}"
        campus_string = campus_num_to_string(int(code_str[5]))
        return f"{season_string} {year_string} - {campus_string}"

    def get_code(self, obj): # pylint: disable=no-self-use
        """ Casts the code to a string, since that's what the frontend expects """
        return str(obj.code)

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
        return f"{obj.dept} {obj.course_num} - {obj.title}"
