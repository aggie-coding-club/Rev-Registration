from rest_framework import generics
from .serializers import CourseSerializer
from .serializers import SectionSerializer
from .models.course import Course
from .models.section import Section

class RetrieveCourseView(generics.RetrieveAPIView):
    """ API endpoint for viewing course information, used by /api/course.
        This view returns a serialized course, should return its title and credit hours.
    """
    serializer_class = CourseSerializer

    def get_object(self):
        """ Overrides default behavior of get_object() to work without a primary key """
        dept = self.request.query_params.get('dept')
        course_num = self.request.query_params.get('course_num')
        term = self.request.query_params.get('term')
        return Course.objects.get(dept=dept, course_num=course_num, term=term)

class RetrieveSectionView(generics.RetrieveAPIView):
    """ API endpoint for viewing course information, used by /api/sections.
        This view returns a serialized section, should return .
    """
    serializer_class = SectionSerializer

    def get_object(self):
        """ Overrides default behavior of get_object() to work without a primary key """
        dept = self.request.query_params.get('dept')
        course_num = self.request.query_params.get('course_num')
        term = self.request.query_params.get('term')
        return Section.objects.get(dept=dept, course_num=course_num, term=term)