import { CourseCardOptions } from '../types/CourseCardOptions';
import Instructor from '../types/Instructor';
import Meeting, { MeetingType } from '../types/Meeting';
import Section, { InstructionalMethod } from '../types/Section';

/* eslint-disable import/prefer-default-export */

/**
 * Allows us to set arbitrary arguments of arguments for easier
 * test-writing
 */
export interface Indexable {
  [key: string]: number | string | boolean[] | Instructor | Section | boolean;
}

/**
 * Mocks the uncertain types returned by HttpResponse.json()
 */
export const fetchMock = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));

const dummySection: Section = {
  id: 123456,
  crn: 123456,
  sectionNum: '501',
  subject: 'ABCD',
  courseNum: '1234',
  minCredits: 0,
  maxCredits: 0,
  currentEnrollment: 25,
  maxEnrollment: 25,
  remote: false,
  honors: false,
  asynchronous: false,
  mcallen: false,
  instructor: new Instructor({ name: 'Dr. Doofenschmirtz' }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
};

const dummyMeeting: Meeting = {
  id: 98765,
  building: 'ACAD',
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 8,
  endTimeMinutes: 50,
  meetingDays: [true, true, true, true, true, true, true],
  meetingType: MeetingType.LEC,
  section: dummySection,
};

/**
 * Helper function that makes a course card. Each argument supplied will be used as the props
 * of a section in the card, and each section will have a single, un-customizaable meeting.
 * Supplying multiple arguments will create multiple sections.
 * @param args properties of the section that matter for this test
 */
export function makeCourseCard(...args: any): CourseCardOptions {
  return {
    sections: args.map((props: any) => {
      const section: Section = {
        ...dummySection,
        ...props,
      };
      return {
        section,
        meetings: [{
          ...dummyMeeting,
          section,
        }],
        selected: false,
      };
    }),
  };
}
