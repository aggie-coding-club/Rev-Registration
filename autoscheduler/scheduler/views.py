from typing import List, Tuple
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser
from rest_framework.response import Response

from scheduler.create_schedules import create_schedules, NoSchedulesError
from scheduler.utils import UnavailableTime, CourseFilter, BasicFilter
from scraper.management.commands.scrape_courses import convert_meeting_time
from scraper.serializers import SectionSerializer
from scraper.models import Section

def _parse_course_filter(course) -> CourseFilter:
    """ Parses the given course to retrieve and convert it to a CourseFilter object
        to be used in create_schedules
    """

    # Can assume subject & course_num will be given as strings
    subject = course["subject"]
    course_num = course["courseNum"]

    sections = course.get("sections", [])

    honors = BasicFilter(course.get("honors"))
    remote = BasicFilter(course.get("remote"))
    asynchronous = BasicFilter(course.get("asynchronous"))

    return CourseFilter(subject=subject, course_num=course_num, section_nums=sections,
                        honors=honors, remote=remote, asynchronous=asynchronous)

def _parse_unavailable_time(avail) -> UnavailableTime:
    """ Parses an availability input and convert it to an UnavailableTime object
        to be used in create_schedules
    """

    start_time = convert_meeting_time(avail["startTime"])
    end_time = convert_meeting_time(avail["endTime"])
    day = avail["day"]

    return UnavailableTime(start_time, end_time, day)

def _serialize_schedules(schedules: List[Tuple[str]]) -> List[List]:
    """ Converts the given schedules, retrieves the corresponding sections,
        then serializes and returns them

    Args:
        schedules: The schedules returned from create_schedules

    Returns
        The list of given schedules with the corresponding serialized sections
    """

    # Retrieve the section models in bulk so we only do one DB query
    # Put the section ids in a set to remove duplicates
    section_set = set(section_id for schedule in schedules for section_id in schedule)
    models = Section.objects.filter(
        id__in=section_set,
    ).select_related('instructor').prefetch_related('meetings')

    # Maps each section's id to their corresponding section model
    sections_dict = {section.id: section for section in models}

    def sections_for_schedule(schedule):
        sections = (sections_dict[section] for section in schedule)

        return SectionSerializer(sections, many=True).data

    return [sections_for_schedule(schedule) for schedule in schedules]

class ScheduleView(APIView):
    """ Handles requests to the generate schedules algorithm  """
    parser_classes = [JSONParser]

    def post(self, request):
        """ Receives a POST request containg the schedule-generating parameters
            and returns a list of generate schedules
        """

        query = request.data

        # List[Tuple[str, str]]
        courses = [_parse_course_filter(course) for course in query["courses"]]
        unavailable_times = [_parse_unavailable_time(avail)
                             for avail in query["availabilities"]]

        term = query["term"]
        include_full = query["includeFull"]

        num_schedules = 5

        schedules = []
        message = ''
        try:
            schedules = create_schedules(courses, term, unavailable_times, include_full,
                                         num_schedules)
        except NoSchedulesError as err:
            message = str(err)

        response = {
            'schedules': _serialize_schedules(schedules),
            'message': message
        }
        return Response(response)
