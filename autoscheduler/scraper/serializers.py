from rest_framework import serializers
from .models.department import Department
from .models.course import Course

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
        desc = season_string + " - " + campus_string

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
