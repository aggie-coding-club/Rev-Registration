import datetime
import django.test

from scraper.management.commands.scrape_courses import parse_section, parse_meeting
from scraper.management.commands.scrape_courses import parse_instructor, parse_course
from scraper.models import Section, Meeting, Instructor, Course
from scraper.tests.utils.load_json import load_json_file

class ScrapeCoursesTests(django.test.TestCase):
    """ Tests scrape_courses-related functions """
    def setUp(self):
        self.section_json = load_json_file("../data/section_input.json")["data"][0]

    def test_parse_section_does_save_model(self):
        """ Tests if parse sections saves the model to the databse correctly
            Does so by calling parse_section on the section_input, and queries for a
        """

        # Arrange
        subject = "CSCE"
        course_num = '121'
        section_num = '501'
        term_code = 202011
        min_credits = 4
        max_enroll = curr_enroll = 22
        section_id = 497223

        # Section model requires an Instructor
        fake_instructor = Instructor(id="Fake", email_address="a@b.c", name="Fake")
        fake_instructor.save()

        # Act
        parse_section(self.section_json, fake_instructor)

        # Assert

        # If this query fails then the section doesn't exist, and thus the section
        # model wasn't saved correctly

        Section.objects.get(id=section_id, subject=subject, course_num=course_num,
                            section_num=section_num, term_code=term_code,
                            current_enrollment=curr_enroll, min_credits=min_credits,
                            max_enrollment=max_enroll, instructor=fake_instructor)

        assert True

    def test_parse_section_does_save_multiple_meetings(self):
        """ Tests if parse_sections correctly creates both meetings for this section
            It does not test if the meetings that it saves are correct
        """

        # Arrange
        expected_num_meetings = 2

        fake_instructor = Instructor(id="Fake", email_address="a@b.c", name="Fake")
        fake_instructor.save()

        # Act
        parse_section(self.section_json, fake_instructor)

        # Assert
        count = Meeting.objects.count()

        assert count == expected_num_meetings

    def test_parse_meeting_does_save_model_correct(self):
        """ Tests if parse_meetings correctly saves the model to the database
            correctly
        """

        # Arrange
        # meeting_id = 4972232020110 # id (497223) + term (202011) + meeting count (0)
        meeting_id = 4972230
        crn = 12323
        building = "ZACH"
        begin_time = datetime.time(13, 50, 0)
        end_time = datetime.time(14, 40, 0)
        meeting_type = "LEC"
        meeting_days = [True, False, True, False, True, False, False]

        # Shouldn't have a name attribute
        instructor = Instructor(id="First Last", email_address="a@b.c", name="First Last")
        instructor.save()

        # Course num is gonna be a character field
        section = Section(id=497223, subject="CSCE", course_num=121, section_num=501,
                          term_code=0, min_credits=0, current_enrollment=0,
                          max_enrollment=0, instructor=instructor)
        section.save() # Must be saved for the assert query to work

        # Act
        parse_meeting(self.section_json["meetingsFaculty"][0], section, 0)

        print(Meeting.objects.all().values())

        # Assert
        # If parse_meeting doesn't save the model correctly, then this query
        # will throw an error, thus failing the test
        Meeting.objects.get(id=meeting_id, crn=crn, building=building,
                            meeting_days=meeting_days, start_time=begin_time,
                            end_time=end_time, meeting_type=meeting_type, section=section)

        assert True

    def test_parse_instructor_does_save_model(self):
        """ Tests if parse instructor saves the model to the database correctly """

        # Arrange
        instructor_id = "John M. Moore"
        email = "jmichael@email.tamu.edu"

        # Act
        parse_instructor(self.section_json)

        # Assert
        # If parse_instructor doesn't save the model correctly, then this query
        # will throw an error, thus failing the test
        Instructor.objects.get(id=instructor_id, email_address=email)

        assert True

    def test_parse_course_does_save_model(self):
        """ Tests if parse_course saves the course to the database correctly """

        # Arrange
        subject = "CSCE"
        course_num = "121"
        title = "INTRO PGM DESIGN CONCEPT"
        # crn = "12323" # Unused, but it shouldn't be
        credit_hours = 4
        term = "202011"

        # Act
        parse_course(self.section_json)

        # Assert
        Course.objects.get(dept=subject, course_num=course_num, title=title,
                           credit_hours=credit_hours, term=term)

        assert True

    # May want to test that the parse_course calls parse_instructor & parse_meeting
    # correctly.
