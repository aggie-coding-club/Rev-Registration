from datetime import time
from rest_framework.test import APITestCase
from django.contrib.sessions.models import Session
from scraper.models import Section, Meeting, Instructor

class SchedulesAPITests(APITestCase):
    """ Test functionality of the saved_schedules sessions api """
    def setUp(self):
        """ Delete sessions table and log in before each test to create a new session """
        Session.objects.all().delete()
        self.client.login()

    def test_get_saved_schedules_gives_error_with_no_term(self):
        """ Tests that /sessions/get_saved_schedules doesn't allow requests without a term
        """
        # Act
        response = self.client.get(f'/sessions/get_saved_courses')

        # Assert
        self.assertEqual(response.status_code, 400)

    def test_get_saved_schedules_defaults_with_no_schedules_for_term(self):
        """ Tests that /sessions/get_saved_schedules gives an empty array when provided
            with a term that has no data
        """
        # Arrange
        term = '202031'
        expected = []

        # Act
        response = self.client.get(f'/sessions/get_saved_schedules?term={term}')

        # Assert
        self.assertEqual(response.json(), expected)
        self.assertEqual(response.status_code, 200)

    def test_get_saved_schedules_gets_schedules_for_term(self):
        """ Tests that /sessions/get_saved_schedules correctly fetches the sections
            and meetings for a given schedule
        """
        # Arrange
        term = '202031'

        # Create the models
        ins = Instructor(id='fake name', email_address='a@b.c')
        ins.save()
        sec = Section(id=1, subject='CSCE', course_num='121', section_num='500',
                      term_code=term, crn=0, min_credits=0, max_credits=0,
                      max_enrollment=0, current_enrollment=0, instructor=ins,
                      asynchronous=False)
        sec.save()
        meeting = Meeting(id=11, section=sec, start_time=time(11, 0),
                          end_time=time(12, 0), meeting_days=[True] * 7,
                          meeting_type='LEC', building='ONLINE')
        meeting.save()

        # Add the schedule to the session
        session = self.client.session
        session_input = [{'name': 'Schedule 1', 'sections': [1]}]
        session[term] = {'schedules': session_input}
        session.save()

        expected = [{
            'name': 'Schedule 1',
            'sections': [{
                'id': 1,
                'subject': 'CSCE',
                'course_num': '121',
                'section_num': '500',
                'crn': 0,
                'min_credits': 0,
                'max_credits': 0,
                'max_enrollment': 0,
                'current_enrollment': 0,
                'instructor_name': 'fake name',
                'honors': None,
                'remote': None,
                'grades': None,
                'asynchronous': False,
                'instructional_method': '',
                'meetings': [{
                    'id': '11',
                    'start_time': '11:00',
                    'end_time': '12:00',
                    'days': [True] * 7,
                    'type': 'LEC',
                    'building': 'ONLINE',
                    'room': None,
                }]
            }]
        }]

        # Act
        response = self.client.get(f'/sessions/get_saved_schedules?term={term}')

        # Assert
        self.assertEqual(response.json(), expected)
        self.assertEqual(response.status_code, 200)
