from collections import OrderedDict
from rest_framework import generics
from rest_framework.response import Response
from scraper.serializers import CourseSerializer
from scraper.serializers import SectionSerializer
from scraper.serializers import TermSerializer
from scraper.serializers import CourseSearchSerializer
from .models.course import Course
from scraper.models import Course, Section, Department

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

class ListSectionView(generics.ListAPIView):
    """ API endpoint for viewing course information, used by /api/sections.
        This view returns a serialized section, should
        return list of all sections for a given course.
    """
    serializer_class = SectionSerializer

    def get_queryset(self):
        """ Overrides default behavior of get_queryset() to work without a primary key """
        dept = self.request.query_params.get('dept')
        course_num = self.request.query_params.get('course_num')
        term = self.request.query_params.get('term')
        return Section.objects.filter(subject=dept, course_num=course_num, term_code=term)

class RetrieveTermView(generics.ListAPIView):
    """ API endpoint for viewing terms, used by /api/terms.

        This view returns all the terms
    """
    def list(self, request):
        """Overrides default behavior of list method so terms are ouput in
           the format {"201831": "Fall 2018 - College Station", ...} Does this by creating
           a new dictionary called formatted_data
        """

        queryset = self.get_queryset()
        serializer = TermSerializer(queryset, many=True)
        formatted_data = {obj['term']: obj['desc'] for obj in serializer.data}
        return Response(formatted_data)

    queryset = Department.objects.all().distinct('term').order_by('-term')
    serializer_class = TermSerializer

class RetrieveCourseSearchView(generics.ListAPIView):
    """ API endpoint for viewing list of courses searched off of
        searchText parameter
    """
    def get_queryset(self):
        """ Overrides default behavior of get_queryset() to work using
            search and term parameter in the url
        """
        search = self.request.query_params.get('search')
        term = self.request.query_params.get('term')
        return Course.objects.filter(id__startswith=search.replace("%20", ""), term=term)


    def list(self, request):
        """ Overrides default behavior of list method so terms are ouput in
           the format {'results': ["CSCE 181", "CSCE 315", ...]} Does this by creating
           a new dictionary called formatted_data
        """

        queryset = self.get_queryset()
        serializer = CourseSearchSerializer(queryset, many=True)
        formatted_data = {'results': [obj['course'] for obj in serializer.data]}
        return Response(formatted_data)

    serializer_class = CourseSearchSerializer
