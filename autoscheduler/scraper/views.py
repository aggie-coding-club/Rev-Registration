from collections import OrderedDict
from rest_framework import generics
from rest_framework.response import Response
from .serializers import TermSerializer
from .serializers import CourseSearchSerializer
from .models.course import Course
from .models.department import Department

class RetrieveTermView(generics.ListAPIView):
    """ API endpoint for viewing terms, used by /api/term.
        This view returns all the terms
    """
    def list(self, request):
        """Overrides default behavior of list method so terms are ouput in
           the format {"201831": "Fall 2018 - College Station", ...} Does this by creating
           a new ordered dictionary called formatted_data"""
        queryset = self.get_queryset()
        serializer = TermSerializer(queryset, many=True)
        formatted_data = OrderedDict()
        for i in serializer.data:
            formatted_data[i['term']] = i['desc']
        return Response(formatted_data)

    queryset = Department.objects.all().distinct('term').order_by('-term')
    serializer_class = TermSerializer

class RetrieveCourseSearchView(generics.ListAPIView):
    """ API endpoint for viewing list of courses searched off of
        searchText parameter"""
    def get_queryset(self):
        """ Overrides default behavior of get_queryset() to work using
            search and term parameter in the url"""
        search = self.request.query_params.get('search')
        term = self.request.query_params.get('term')
        return Course.objects.filter(id__contains=search, term=term)

    def list(self, request):
        """Overrides default behavior of list method so terms are ouput in
           the format {'results': ["CSCE 181", "CSCE 315", ...]} Does this by creating
           a new ordered dictionary called formatted_data"""
        queryset = self.get_queryset()
        serializer = CourseSearchSerializer(queryset, many=True)
        formatted_data = OrderedDict()
        courses = []
        for i in serializer.data:
            courses.append(i['course'])
        formatted_data['results'] = courses
        return Response(formatted_data)

    queryset = Course.objects.filter()
    serializer_class = CourseSearchSerializer
