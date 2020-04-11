import datetime
import django.test

from scraper.management.commands.scrape_courses import (
    parse_section, parse_meeting, parse_instructor, parse_course, convert_meeting_time
)
from scraper.models import Section, Meeting, Instructor, Course
from scraper.tests.utils.load_json import load_json_file

class ScrapeCoursesTests(django.test.TestCase):
    """ Tests scrape_courses-related functions """
    def setUp(self):
        course_list = load_json_file("../data/section_input.json")["data"]

        # Get corresponding sections from course list
        self.csce_section_json = next(course for course in course_list
                                      if course["id"] == 497223)
        self.law_section_json = next(course for course in course_list
                                     if course["id"] == 491083)
        self.engl_section_json = next(course for course in course_list
                                      if course["id"] == 511984)
        self.pols_section_json = next(course for course in course_list
                                      if course["id"] == 469982)
        self.acct_section_json = next(course for course in course_list
                                      if course["id"] == 467471)
        self.csce_web_section_json = next(course for course in course_list
                                          if course["id"] == 515269)

    def test_parse_section_does_save_model(self):
        """ Tests if parse sections saves the model to the database correctly
            Does so by calling parse_section on the section_input, and queries for
            a Section with the expected attributes
        """

        # Arrange
        subject = "CSCE"
        course_num = "121"
        section_num = "501"
        term_code = 202011
        crn = 12323
        min_credits = 4
        max_enroll = curr_enroll = 22
        section_id = 497223

        # Section model requires an Instructor
        fake_instructor = Instructor(id="Fake", email_address="a@b.c")
        fake_instructor.save()

        # Act
        section, meetings = parse_section(self.csce_section_json, fake_instructor)
        section.save()
        Meeting.objects.bulk_create(meetings)

        # Assert

        # If this query fails then the section doesn't exist, and thus the section
        # model wasn't saved correctly

        Section.objects.get(id=section_id, subject=subject, course_num=course_num,
                            section_num=section_num, term_code=term_code, crn=crn,
                            current_enrollment=curr_enroll, min_credits=min_credits,
                            max_enrollment=max_enroll, instructor=fake_instructor)

    def test_parse_section_does_save_multiple_meetings(self):
        """ Tests if parse_sections correctly creates both meetings for this section
            It does not test if the meetings that it saves are correct
        """

        # Arrange
        expected_num_meetings = 2

        fake_instructor = Instructor(id="Fake", email_address="a@b.c")
        fake_instructor.save()

        # Act
        section, meetings = parse_section(self.csce_section_json, fake_instructor)
        section.save()
        Meeting.objects.bulk_create(meetings)

        # Assert
        count = Meeting.objects.count()

        self.assertEqual(count, expected_num_meetings)

    def test_parse_meeting_does_save_model_correct(self):
        """ Tests if parse_meetings correctly saves the model to the database
            correctly
        """

        # Arrange
        meeting_id = 4972230
        crn = 12323
        building = "ZACH"
        begin_time = datetime.time(13, 50, 0)
        end_time = datetime.time(14, 40, 0)
        meeting_type = "LEC"
        meeting_days = [True, False, True, False, True, False, False]

        instructor = Instructor(id="First Last", email_address="a@b.c")
        instructor.save()

        # Course num is gonna be a character field
        section = Section(id=497223, subject="CSCE", course_num=121, section_num=501,
                          term_code=0, crn=crn, min_credits=0, current_enrollment=0,
                          max_enrollment=0, instructor=instructor)
        section.save() # Must be saved for the assert query to work

        # Act
        meeting = parse_meeting(self.csce_section_json["meetingsFaculty"][0], section, 0)
        meeting.save()

        # Assert
        # If parse_meeting doesn't save the model correctly, then this query
        # will throw an error, thus failing the test
        Meeting.objects.get(id=meeting_id, building=building, meeting_days=meeting_days,
                            start_time=begin_time, end_time=end_time,
                            meeting_type=meeting_type, section=section)

    def test_parse_instructor_does_save_model(self):
        """ Tests if parse instructor saves the model to the database correctly """

        # Arrange
        instructor_id = "John M. Moore"
        email = "jmichael@email.tamu.edu"

        # Act
        instructor = parse_instructor(self.csce_section_json, set())
        instructor.save()

        # Assert
        # If parse_instructor doesn't save the model correctly, then this query
        # will throw an error, thus failing the test
        Instructor.objects.get(id=instructor_id, email_address=email)

    def test_parse_course_does_save_model(self):
        """ Tests if parse_course saves the course to the database correctly """

        # Arrange
        subject = "CSCE"
        course_num = "121"
        title = "INTRO PGM DESIGN CONCEPT"
        credit_hours = 4
        term = "202011"

        # Act
        course, *_ = parse_course(self.csce_section_json, set(), set())
        course.save()

        # Assert
        Course.objects.get(dept=subject, course_num=course_num, title=title,
                           credit_hours=credit_hours, term=term)

    def test_parse_course_accept_alphanumeric_course_num(self):
        """ Tests if parse_course accepts alphanumberic course_num field (eg. 7500S) """

        # Arrange
        subject = "LAW"
        course_num = "7500S"
        title = "SPORTS LAW"
        credit_hours = 3
        term = "201931"

        # Act
        course, *_ = parse_course(self.law_section_json, set(), set())
        course.save()

        # Assert
        Course.objects.get(dept=subject, course_num=course_num, title=title,
                           credit_hours=credit_hours, term=term)

    def test_parse_course_removes_html_escapes(self):
        """ Tests if parse_course removes escaped HTML characters, like &amp;
            from the title
        """

        # Arrange
        subject = "POLS"
        course_num = "207"
        # Actual title: "STATE &amp; LOCAL GOVT"
        correct_title = "STATE & LOCAL GOVT"
        credit_hours = 3
        term = "201931"

        # Act
        course, *_ = parse_course(self.pols_section_json, set(), set())
        course.save()

        # Assert
        Course.objects.get(dept=subject, course_num=course_num, title=correct_title,
                           credit_hours=credit_hours, term=term)

    def test_parse_course_removes_hnr(self):
        """ Tests if parse_course removes the "HNR-" in front of honors sections """

        # Arrange
        subject = "ACCT"
        course_num = "229"
        # Actual title: "HNR-INTRO ACCOUNTING"
        correct_title = "INTRO ACCOUNTING"
        credit_hours = 3
        term = "201931"

        # Act
        course, *_ = parse_course(self.acct_section_json, set(), set())
        course.save()

        # Assert
        Course.objects.get(dept=subject, course_num=course_num, title=correct_title,
                           credit_hours=credit_hours, term=term)

    def test_parse_course_fills_instructor_and_meeting(self):
        """ Tests if parse_course also adds an instructor and meeting to the database """

        # Arrange
        instructor_id = "John M. Moore"
        instructor_email = "jmichael@email.tamu.edu"
        instructor = Instructor(id=instructor_id, email_address=instructor_email)

        meeting_id = 4972230
        crn = 12323
        building = "ZACH"
        begin_time = datetime.time(13, 50, 0)
        end_time = datetime.time(14, 40, 0)
        meeting_type = "LEC"
        meeting_days = [True, False, True, False, True, False, False]
        section = Section(id=497223, subject="CSCE", course_num=121, section_num=501,
                          term_code=0, crn=crn, min_credits=0, current_enrollment=0,
                          max_enrollment=0, instructor=instructor)

        #Act
        course, instructor, (section, meetings) = parse_course(self.csce_section_json,
                                                               set(), set())
        instructor.save()
        section.save()
        Meeting.objects.bulk_create(meetings)
        course.save()

        # Assert
        Instructor.objects.get(id=instructor_id, email_address=instructor_email)
        Meeting.objects.get(id=meeting_id, building=building,
                            meeting_days=meeting_days, start_time=begin_time,
                            end_time=end_time, meeting_type=meeting_type, section=section)

    def test_parse_section_handles_alphanumeric_section_num(self):
        """ Tests if parse_section accepts an alphanumeric section_num """

        # Arrange
        subject = "ENGL"
        course_num = "210"
        section_num = "M99"
        term_code = 202011
        crn = 36167
        min_credits = 3
        honors = False
        web = False
        max_enroll = 25
        curr_enroll = 3
        section_id = 511984

        # Section model requires an Instructor
        fake_instructor = Instructor(id="Fake", email_address="a@b.c")
        fake_instructor.save()

        # Act
        section, _ = parse_section(self.engl_section_json, fake_instructor)
        section.save()

        # Assert
        Section.objects.get(id=section_id, subject=subject, course_num=course_num,
                            section_num=section_num, term_code=term_code, crn=crn,
                            current_enrollment=curr_enroll, min_credits=min_credits,
                            max_enrollment=max_enroll, instructor=fake_instructor,
                            honors=honors, web=web)

    def test_parse_section_gets_honors(self):
        """ Tests if parse_section correctly sets honors to True for an honors course """

        # Arrange
        subject = "ACCT"
        course_num = "229"
        section_num = "202"
        term_code = 201931
        crn = 10004
        min_credits = 3
        honors = True
        web = False
        max_enroll = 0
        curr_enroll = 24
        section_id = 467471

        # Section model requires an Instructor
        fake_instructor = Instructor(id="Fake", email_address="a@b.c")
        fake_instructor.save()

        # Act
        section, _ = parse_section(self.acct_section_json, fake_instructor)
        section.save()

        # Assert
        Section.objects.get(id=section_id, subject=subject, course_num=course_num,
                            section_num=section_num, term_code=term_code, crn=crn,
                            current_enrollment=curr_enroll, min_credits=min_credits,
                            max_enrollment=max_enroll, instructor=fake_instructor,
                            honors=honors, web=web)

    def test_parse_section_gets_web(self):
        """ Tests if parse_section correctly sets web to True for an online course """

        # Arrange
        subject = "CSCE"
        course_num = "121"
        section_num = "M99"
        term_code = 201931
        crn = 40978
        min_credits = 4
        honors = False
        web = True
        max_enroll = 10
        curr_enroll = 10
        section_id = 515269

        # Section model requires an Instructor
        fake_instructor = Instructor(id="Fake", email_address="a@b.c")
        fake_instructor.save()

        # Act
        section, _ = parse_section(self.csce_web_section_json, fake_instructor)
        section.save()

        # Assert
        Section.objects.get(id=section_id, subject=subject, course_num=course_num,
                            section_num=section_num, term_code=term_code, crn=crn,
                            current_enrollment=curr_enroll, min_credits=min_credits,
                            max_enrollment=max_enroll, instructor=fake_instructor,
                            honors=honors, web=web)

    def test_convert_meeting_time_returns_correct_time(self):
        """ Tests that scrape_courses.convert_meeting_time can handle a normal time """

        # Act
        time = convert_meeting_time("1230")

        # Assert
        self.assertEqual(time, datetime.time(12, 30))

    def test_convert_meeting_time_handles_null_time(self):
        """ Tests that scrape_courses.convert_meeting_time can handle Null times """

        # Act
        time = convert_meeting_time(None)

        # Assert
        self.assertIsNone(time)
