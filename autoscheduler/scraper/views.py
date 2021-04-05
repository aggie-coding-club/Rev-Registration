from itertools import chain, islice
import logging
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from scraper.serializers import (
    TermSerializer, CourseSearchSerializer, CourseSerializer, SectionSerializer)
from scraper.models import Course, Section, Grades, Term

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
        This view returns a serialized list of sections for a given course.
    """
    serializer_class = SectionSerializer

    def get_queryset(self):
        """ Overrides default behavior of get_queryset() to work without a primary key """
        # Temp: test that logging works without cloud logging import
        logging.error('(Test, not an actual error): logging.error shows without import')

        dept = self.request.query_params.get('dept')
        course_num = self.request.query_params.get('course_num')
        term = self.request.query_params.get('term')
        return Section.objects.filter(
            subject=dept, course_num=course_num, term_code=term
        ).order_by('id').select_related('instructor').prefetch_related('meetings')

class RetrieveTermView(generics.ListAPIView):
    """ API endpoint for viewing terms, used by /api/terms.

        This view returns all the terms
    """
    def get_queryset(self):
        def term_code_value(model):
            """ Comparison key function for terms, when sorted in reverse order this
                sorts departments in descending year, with terms in College Station first
            """
            term = model.code
            return term - 2 * (term % 10)

        return sorted(Term.objects.all().only('code'),
                      key=term_code_value, reverse=True)

    def list(self, request): # pylint: disable=arguments-differ
        """ Overrides default behavior of list method so terms are ouput in
           the format {"201831": "Fall 2018 - College Station", ...} Does this by creating
           a new dictionary called formatted_data
        """
        queryset = self.get_queryset()
        serializer = TermSerializer(queryset, many=True)
        formatted_data = {obj['desc']: obj['code'] for obj in serializer.data}
        return Response(formatted_data)

    serializer_class = TermSerializer

class RetrieveCourseSearchView(generics.ListAPIView):
    """ API endpoint for viewing list of courses searched off of
        searchText parameter
    """
    def get_queryset(self):
        """ Overrides default behavior of get_queryset() to work using
            search and term parameter in the url
        """
        # Spaces are desired when searching by title, but not by id
        title_search = self.request.query_params.get('search').upper().replace("%20", " ")
        id_search = title_search.replace(" ", "")
        term = self.request.query_params.get('term')
        # Get all courses that match by id or title
        matching_id = Course.objects.filter(
            id__startswith=id_search, term=term).order_by('dept', 'course_num')
        matching_title = Course.objects.filter(
            title__startswith=title_search, term=term).order_by('dept', 'course_num')
        # Combine results - courses matching by id will come first, followed by those
        # with matching titles. A convenient side-effect of this is that the second
        # query will only execute if the first query doesn't return enough results
        return islice(chain(matching_id, matching_title), 25)

    def list(self, request): # pylint: disable=arguments-differ
        """ Overrides default behavior of list method so terms are ouput in
           the format {'results': ["CSCE 181", "CSCE 315", ...]} Does this by creating
           a new dictionary called formatted_data
        """
        queryset = self.get_queryset()
        serializer = CourseSearchSerializer(queryset, many=True)
        formatted_data = {'results': [obj['course'] for obj in serializer.data]}
        return Response(formatted_data)

    serializer_class = CourseSearchSerializer

class RetrieveGradesView(APIView):
    """ API endpoint for viewing grade counts and avg gpa of instructor for all
        their sections for that course. All terms taken into account
    """

    def get(self, request):
        """ Overrides default behavior of get_object() to work using
            instructor, subject, and course parameter in the url
        """
        instructor = self.request.query_params.get('instructor')
        subject = self.request.query_params.get('subject').upper()
        course_num = self.request.query_params.get('course_num')
        honors = self.request.query_params.get('honors')
        data = Grades.objects.instructor_performance(subject, course_num,
                                                     instructor, honors)
        return Response(data)

@api_view(['GET'])
def get_last_updated(request):
    """ Takes in a term and attempts to retrieve when that term was last updated.
        Returns undefined (empty string) if it does not find one.
    """
    term = request.query_params.get('term')

    if not term:
        return Response(status=400)

    try:
        return Response(Term.objects.get(code=term).last_updated)
    except Term.DoesNotExist:
        return Response()
