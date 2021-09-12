from datetime import time
from rest_framework.test import APITestCase
from django.contrib.sessions.models import Session
from scraper.models import Section, Meeting, Instructor

def create_models(term: str):
    """ Creates the models for saved schedules tests """
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
        response = self.client.get('/sessions/get_saved_courses')

        # Assert
        self.assertEqual(response.status_code, 400)

    def test_get_saved_schedules_defaults_with_no_schedules_for_term(self):
        """ Tests that /sessions/get_saved_schedules gives an empty array when provided
            with a term that has no data
        """
        # Arrange
        term = '202031'
        expected = {'selectedSchedule': None, 'schedules': []}

        # Act
        response = self.client.get(f'/sessions/get_saved_schedules?term={term}')

        # Assert
        self.assertEqual(response.json(), expected)
        self.assertEqual(response.status_code, 200)

    def test_get_saved_schedules_if_locked_unavailable_returns_true_for_it(self):
        """ Tests that if the locked (aka "saved") flag is not available in the schedule,
            that it defaults to true for it.
            The assumption being that in the previous version of get_saved_schedules
            we were not storing the locked flag - thus if it's not available, then it was
            previously locked (aka saved).
        """
        # Arrange
        term = '202031'
        create_models(term)

        # Add the schedule to the session
        session = self.client.session
        # Note there's no 'locked' value below
        session_input = [{'name': 'Schedule 1', 'sections': [1] }]
        session[term] = {'schedules': session_input, 'selected_schedule': 0}
        session.save()

        expected = True

        # Act
        response = self.client.get(f'/sessions/get_saved_schedules?term={term}')

        # Assert
        actual = response.json()['schedules'][0]['locked']

        self.assertEqual(actual, expected)

    def test_get_saved_schedules_selected_schedules_defaults_to_null(self):
        """ Tests that if the "selected_schedules" session is not available, that it
            defaults to None.
            This is mainly here to test that for old versions of saved_schedules, that the
            new version doesn't break anything
        """
        # Arrange
        term = '202031'

        # Add the schedule to the session
        session = self.client.session
        # Note 'selected_schedules' is not present below
        session[term] = {'schedules': []}
        session.save()

        expected = None

        # Act
        response = self.client.get(f'/sessions/get_saved_schedules?term={term}')

        # Assert
        actual = response.json()['selectedSchedule']

        self.assertEqual(actual, expected)

    def test_get_saved_schedules_gets_schedules_for_term(self):
        """ Tests that /sessions/get_saved_schedules correctly fetches the sections
            and meetings for a given schedule
        """
        # Arrange
        term = '202031'
        create_models(term)

        # Add the schedule to the session
        session = self.client.session
        session_input = [{'name': 'Schedule 1', 'sections': [1], 'locked': False}]
        session[term] = {'schedules': session_input, 'selected_schedule': 0}
        session.save()

        expected_schedules = [{
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
                }]
            }],
            'locked': False,
        }]

        expected = {
            'selectedSchedule': 0,
            'schedules': expected_schedules,
        }

        # Act
        response = self.client.get(f'/sessions/get_saved_schedules?term={term}')

        # Assert
        self.assertEqual(response.json(), expected)
        self.assertEqual(response.status_code, 200)
