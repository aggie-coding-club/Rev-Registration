from rest_framework import serializers
from scraper.models import Course, Section, Meeting, Department

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


    def get_desc(self, obj):
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

    def get_course(self, obj):
        """ Gets list of items in for dept course i.e CSCE 121 """
        return f"{obj.dept} {obj.course_num}"
