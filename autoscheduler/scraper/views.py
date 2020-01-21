from rest_framework import generics

from .serializers import CourseSerializer
from .models.course import Course

class RetrieveCourseView(generics.ListAPIView):
    """ API endpoint for viewing course information """
    serializer_class = CourseSerializer

    def get_queryset(self):
        dept = self.request.query_params.get('dept')
        course_num = self.request.query_params.get('course_num')
        term = self.request.query_params.get('term')
        return Course.objects.filter(dept=dept, course_num=course_num, term=term)
