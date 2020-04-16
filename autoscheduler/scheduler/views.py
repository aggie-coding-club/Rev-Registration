import json
from typing import List, Tuple
from rest_framework.views import APIView
from rest_framework.response import Response

from scheduler.create_schedules import create_schedules
from scheduler.utils import UnavailableTime, CourseFilter
from scraper.management.commands.scrape_courses import convert_meeting_time
from scraper.serializers import SectionSerializer
from scraper.models import Section

def _parse_course_filter(courses) -> List[CourseFilter]:
    """ Parses the given courses to retrieve and converts them to CourseFilter objects
        to be used in create_schedules
    """

    output = []

    for course in courses:
        subject = str(course["subject"])
        course_num = str(course["courseNum"])

        sections = course["sections"]

        honors = course["honors"]
        web = course["web"]

        output.append(CourseFilter(subject=subject, course_num=course_num,
                                   section_nums=sections, honors=honors, web=web))
    return output

def _parse_unavailable_times(availabilities) -> List[UnavailableTime]:
    """ Parses the availabilities input and converts them to UnavailableTime objects
        to be used in create_schedules
    """

    unavailable_times = []
    for avail in availabilities:
        start_time = convert_meeting_time(avail["startTime"])
        end_time = convert_meeting_time(avail["endTime"])
        day = int(avail["day"])

        unavailable_times.append(UnavailableTime(start_time, end_time, day))

    return unavailable_times

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
    models = Section.objects.filter(id__in=section_set)

    # Maps each section's id to their corresponding section model
    sections_dict = {section.id: section for section in models.iterator()}

    def sections_for_schedule(schedule):
        sections = (sections_dict[int(section)] for section in schedule)

        return SectionSerializer(sections, many=True).data

    return [sections_for_schedule(schedule) for schedule in schedules]

class ScheduleView(APIView):
    """ Handles requests to the generate schedules algorithm  """

    def post(self, request):
        """ Receives a POST request containg the schedule-generating parameters
            and returns a list of generate schedules
        """

        query = json.loads(request.body)

        # List[Tuple[str, str]]
        courses = _parse_course_filter(query["courses"])
        unavailable_times = _parse_unavailable_times(query["availabilities"])

        term = query["term"]
        include_full = query["includeFull"]

        num_schedules = 5
        schedules = create_schedules(courses, term, unavailable_times, include_full,
                                     num_schedules)

        return Response(_serialize_schedules(schedules))
