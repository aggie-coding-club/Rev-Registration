""" Tests all of the models functions """

from datetime import time
import django.test
from pytest import raises

from scheduler.create_schedules import (
    _get_meetings, _schedule_valid, create_schedules, NoSchedulesError
)
from scheduler.utils import CourseFilter, UnavailableTime, BasicFilter
from scraper.models import Instructor, Meeting, Section

class SchedulingTests(django.test.TestCase):
    """ Tests for generate_schedules and its helper functions """
    @classmethod
    def setUpTestData(cls):
        instructor = Instructor(id="Akash Tyagi")
        instructor.save()
        cls.sections = [
            # Sections for CSCE 310
            Section(crn=12345, id=1, subject='CSCE', course_num='310',
                    section_num='501', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12346, id=2, subject='CSCE', course_num='310',
                    section_num='502', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12347, id=3, subject='CSCE', course_num='310',
                    section_num='503', term_code='201911', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            # Sections for CSCE 121
            Section(crn=12348, id=4, subject='CSCE', course_num='121',
                    section_num='501', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            Section(crn=12349, id=5, subject='CSCE', course_num='121',
                    section_num='502', term_code='201931', min_credits='3',
                    honors=False, web=True, max_enrollment=50,
                    current_enrollment=50, instructor=instructor),
            Section(crn=12350, id=6, subject='CSCE', course_num='121',
                    section_num='201', term_code='201931', min_credits='3',
                    honors=True, web=False, max_enrollment=50,
                    current_enrollment=40, instructor=instructor),
            # Sections for CSCE 221 (note that none have available seats)
            Section(crn=12351, id=7, subject='CSCE', course_num='221',
                    section_num='501', term_code='201931', min_credits='3',
                    honors=False, web=False, max_enrollment=50,
                    current_enrollment=50, instructor=instructor),
        ]
        Section.objects.bulk_create(cls.sections)

    def assert_meetings_match_expected(self, meetings, valid_sections,
                                       meetings_for_sections):
        """ Helper function to check that generated meetings are correct. Fails the test
            if they aren't.

        Args:
            meetings: values returned by _get_meetings
            valid_sections: set of expected section ids
            meetings_for_sections: dict mapping section_num to the meetings it
                                   should contain
        """
        # Since I modify model data, I can't compare them directly so make sure
        # each valid section id is in meetings, all sections in meetings are valid, and
        # there are the correct number of them
        for section, section_meetings in meetings.items():
            self.assertIn(section, valid_sections)

            # Make sure the correct number of meetings are in each section
            actual_section_meetings = meetings_for_sections[section]
            self.assertEqual(set(section_meetings), set(actual_section_meetings),
                             msg=f"Section {section}: found meetings {section_meetings}"
                                 f", expected {actual_section_meetings}")

        # Check all sections for the course are contained in meetings
        self.assertEqual(set(meetings), set(valid_sections),
                         msg=f"Sections not matching: got {meetings}, "
                             f"expected {set(valid_sections)}")

    def test__get_meetings_gets_all_meetings(self):
        """ Tests that _get_meetings gets all sections/meetings for the specified term
            and groups them correctly
        """
        # Arrange
        course = CourseFilter("CSCE", "310")
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 310-503
            Meeting(id=30, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[2]),
            Meeting(id=31, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[2]),
        ]
        Meeting.objects.bulk_create(meetings)
        valid_sections = set((1, 2))
        meetings_for_sections = {1: meetings[0:2], 2: meetings[2:4]}
        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_handles_unavailability(self):
        """ Tests that _get_meetings filters sections with meetings conflicting
            with the given unavailable_times
        """
        # Arrange
        course = CourseFilter("CSCE", "310")
        term = "201931"
        include_full = True
        unavailable_times = (UnavailableTime(time(8), time(8, 30), 4),)
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 502 should be filtered because of the unavailable time
        valid_sections = set((1,))
        meetings_for_sections = {1: meetings[0:2]}
        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_filters_section_nums(self):
        """ Tests that _get_meetings filters sections not in the CourseFilter's
            section_nums
        """
        # Arrange
        course = CourseFilter("CSCE", "310", section_nums=[501])
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 502 should be filtered because it isn't in section_nums
        valid_sections = set((1,))
        meetings_for_sections = {1: meetings[0:2]}
        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_filters_non_honors(self):
        """ Tests that _get_meetings filters out non-honors sections if the honors
            attribute of the CourseFilter is 'only'
        """
        # Arrange
        course = CourseFilter("CSCE", "121", honors=BasicFilter.ONLY)
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
            # Meetings for CSCE 121-201
            Meeting(id=60, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[5]),
            Meeting(id=61, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[5]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 502 should be filtered because it isn't an honors section
        valid_sections = set((6,))
        meetings_for_sections = {6: meetings[2:]}

        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_filters_honors(self):
        """ Tests that _get_meetings filters honors sections if the honors attribute
            of the CourseFilter is 'exclude'
        """
        # Arrange
        course = CourseFilter("CSCE", "121",
                              honors=BasicFilter.EXCLUDE,
                              web=BasicFilter.NO_PREFERENCE)
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
            # Meetings for CSCE 121-201
            Meeting(id=60, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[5]),
            Meeting(id=61, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[5]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 201 should be filtered because it is an honors section
        valid_sections = set((5,))
        meetings_for_sections = {5: meetings[0:2]}

        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_filters_non_web(self):
        """ Tests that _get_meetings filters non-web sections if the web attribute
            of the CourseFilter is 'only'
        """
        # Arrange
        course = CourseFilter("CSCE", "121", web=BasicFilter.ONLY)
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 501 should be filtered because it isn't a web section
        valid_sections = set((5,))
        meetings_for_sections = {5: meetings[2:]}

        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_filters_web(self):
        """ Tests that _get_meetings filters web sections if the honors attribute
            of the CourseFilter is 'exclude'
        """
        # Arrange
        course = CourseFilter("CSCE", "121", web=BasicFilter.EXCLUDE)
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 502 should be filtered because it's a web section
        valid_sections = set((4,))
        meetings_for_sections = {4: meetings[0:2]}

        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__get_meetings_filters_full(self):
        """ Tests that _get_meetings filters sections with no available seats if the
            include_full attribute of the CourseFilter is False
        """
        # Arrange
        course = CourseFilter("CSCE", "121")
        term = "201931"
        include_full = False
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Section 502 should be filtered because it has no available seats
        valid_sections = set((4,))
        meetings_for_sections = {4: meetings[0:2]}

        # Act
        meetings = _get_meetings(course, term, include_full, unavailable_times)

        # Assert
        self.assert_meetings_match_expected(meetings, valid_sections,
                                            meetings_for_sections)

    def test__schedule_valid_true_for_valid_schedule(self):
        """ Tests that _schedule_valid returns true for a valid schedule """
        # Test a schedule for 201931 containing CSCE 310-501 and CSCE 121-501
        # Arrange
        meetings = [
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Convert meetings to expected format (set of days they meet)
        for meeting in meetings:
            meeting.meeting_days = set(i for i, day in enumerate(meeting.meeting_days)
                                       if day)
        meetings = ({"502": meetings[0:2]}, {"502": meetings[2:]})
        schedule = ("502", "502")

        # Act
        valid = _schedule_valid(meetings, schedule)

        # Assert
        self.assertTrue(valid)

    def test__schedule_valid_false_for_invalid_schedule(self):
        """ Tests that _schedule_valid returns false for an invalid schedule """
        # Test a schedule for 201931 containing CSCE 310-501 CSCE 121-501
        # Arrange
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
        ]
        Meeting.objects.bulk_create(meetings)
        # Convert meetings to expected format (set of days they meet)
        for meeting in meetings:
            meeting.meeting_days = set(i for i, day in enumerate(meeting.meeting_days)
                                       if day)
        meetings = ({"501": meetings[0:2]}, {"501": meetings[2:]})
        schedule = ("501", "501")

        # Act
        valid = _schedule_valid(meetings, schedule)

        # Assert
        self.assertFalse(valid)

    def test_create_schedules_creates_all_valid_schedules(self):
        """ Tests that create_schedules makes all valid schedules and doesn't
            return any invalid ones
        """
        # There are 4 possible schedules to generate, 2 are valid
        # Arrange
        courses = (
            CourseFilter("CSCE", "310"),
            CourseFilter("CSCE", "121",
                         honors=BasicFilter.NO_PREFERENCE,
                         web=BasicFilter.NO_PREFERENCE)
        )
        term = "201931"
        include_full = True
        unavailable_times = []
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        expected_schedules = set(((1, 5), (2, 5)))

        # Act
        schedules = set(create_schedules(courses, term, unavailable_times, include_full,
                                         num_schedules=10))

        # Act
        self.assertEqual(schedules, expected_schedules)


    def test_create_schedules_uses_unavailable_times(self):
        """ Tests that create_schedule filters out the provided unavailable_times. """
        # There are 4 possible schedules to generate, 1 is valid given the
        # unavailable times
        # Arrange
        courses = (
            CourseFilter("CSCE", "310"),
            CourseFilter("CSCE", "121",
                         honors=BasicFilter.NO_PREFERENCE,
                         web=BasicFilter.NO_PREFERENCE)
        )
        term = "201931"
        include_full = True
        unavailable_times = [UnavailableTime(time(9, 1), time(9, 2), 4)]
        meetings = [
            # Meetings for CSCE 310-501
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=11, meeting_days=[True] * 7, start_time=time(9),
                    end_time=time(9, 50), meeting_type='LEC', section=self.sections[0]),
            # Meetings for CSCE 310-502
            Meeting(id=20, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[1]),
            Meeting(id=21, meeting_days=[True] * 7, start_time=time(8),
                    end_time=time(8, 50), meeting_type='LAB', section=self.sections[1]),
            # Meetings for CSCE 121-501
            Meeting(id=40, meeting_days=[True] * 7, start_time=time(11, 30),
                    end_time=time(12, 20), meeting_type='LEC', section=self.sections[3]),
            Meeting(id=41, meeting_days=[True] * 7, start_time=time(9, 10),
                    end_time=time(10), meeting_type='LAB', section=self.sections[3]),
            # Meetings for CSCE 121-502
            Meeting(id=50, meeting_days=[True] * 7, start_time=time(12, 30),
                    end_time=time(1, 20), meeting_type='LEC', section=self.sections[4]),
            Meeting(id=51, meeting_days=[True] * 7, start_time=time(10),
                    end_time=time(10, 50), meeting_type='LAB', section=self.sections[4]),
        ]
        Meeting.objects.bulk_create(meetings)
        expected_schedules = set(((2, 5),))

        # Act
        schedules = set(create_schedules(courses, term, unavailable_times, include_full,
                                         num_schedules=10))

        # Assert
        self.assertEqual(schedules, expected_schedules)

    def test_create_schedules_throws_when_no_sections_have_seats(self):
        """ Tests that create_schedules throws an appropriate error when no sections
            have available seats, and include_full is set to False.
        """
        # Arrange
        subject = 'CSCE'
        course_num = '221'
        courses = (CourseFilter(subject, course_num),)
        term = '201931'
        include_full = False
        unavailable_times = []
        expected_error = f'No sections for {subject} {course_num} have available seats'

        # Act + Assert
        with raises(NoSchedulesError, match=expected_error):
            create_schedules(courses, term, unavailable_times, include_full)

    def test_create_schedules_throws_when_no_sections_match_availability(self):
        """ Tests that create_schedules throws an appropriate error when no sections
            match the selected availabilities.
        """
        # Arrange
        subject = 'CSCE'
        course_num = '221'
        courses = (CourseFilter(subject, course_num),)
        term = '201931'
        include_full = True
        unavailable_times = [UnavailableTime(time(0, 0), time(23, 59), 0)]
        Meeting(id=70, meeting_days=[True, *[False] * 6], start_time=time(0, 0),
                end_time=time(23, 59), meeting_type='LEC', section=self.sections[6]
                ).save()
        expected_error = (f'No sections for {subject} {course_num} are compatible '
                          'with your available times')

        # Act + Assert
        with raises(NoSchedulesError, match=expected_error):
            create_schedules(courses, term, unavailable_times, include_full)

    def test_create_schedules_throws_when_no_schedules_are_possible(self):
        """ Tests that create_schedules throws an appropriate error when all sections
            for the chosen courses overlap, meaning no schedules are possible
        """
        # Arrange
        courses = (
            CourseFilter('CSCE', '221'),
            CourseFilter('CSCE', '310', section_nums=['501']),
        )
        term = '201931'
        include_full = True
        unavailable_times = []
        meetings = [
            Meeting(id=10, meeting_days=[True] * 7, start_time=time(0, 0),
                    end_time=time(23, 59), meeting_type='LEC', section=self.sections[0]),
            Meeting(id=70, meeting_days=[True] * 7, start_time=time(0, 0),
                    end_time=time(23, 59), meeting_type='LEC', section=self.sections[6]),
        ]
        Meeting.objects.bulk_create(meetings)
        expected_error = 'No schedules are possible with the selected constraints'

        # Act + Assert
        with raises(NoSchedulesError, match=expected_error):
            print(create_schedules(courses, term, unavailable_times, include_full))
