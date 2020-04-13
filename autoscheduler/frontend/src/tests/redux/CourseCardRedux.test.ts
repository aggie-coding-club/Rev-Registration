import { parseMeetings } from '../../redux/actions/courseCards';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';

// The input from the backend use snake_case, so disable camelcase errors for this file
/* eslint-disable @typescript-eslint/camelcase */
describe('Course Cards Redux', () => {
  describe('parseMeeting', () => {
    describe('parses correctly', () => {
      test('on a normal input', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          web: false,
          honors: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: null,
          currentEnrollment: 0,
          maxEnrollment: 1,
          instructor: new Instructor({ name: 'Instructor Name' }),
        });

        const expected = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 8,
            startTimeMinutes: 0,
            endTimeHours: 8,
            endTimeMinutes: 50,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        // act
        const output = parseMeetings(input);

        // assert
        expect(output).toEqual(expected);
      });
    });
  });
});
