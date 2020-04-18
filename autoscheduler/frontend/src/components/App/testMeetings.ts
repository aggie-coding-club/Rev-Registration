import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';

// DEBUG
const testSection1 = new Section({
  id: 123456,
  crn: 123456,
  subject: 'SUBJ',
  courseNum: '234',
  sectionNum: '500',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 56,
  maxEnrollment: 56,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
});

const testSection2 = new Section({
  id: 654321,
  crn: 654321,
  subject: 'DEPT',
  courseNum: '123',
  sectionNum: '524',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 67,
  maxEnrollment: 67,
  instructor: new Instructor({
    name: 'James Pennington',
  }),
});

const testSection3 = new Section({
  id: 654631,
  crn: 473748,
  subject: 'BIOL',
  courseNum: '319',
  sectionNum: '205',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 24,
  maxEnrollment: 24,
  instructor: new Instructor({
    name: 'William Cohn',
  }),
});

const testMeeting = new Meeting({
  id: 123456,
  building: 'HRBB',
  meetingDays: [true, false, true, false, true, false, false],
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSection1,
});

const testMeeting2 = new Meeting({
  id: 123456,
  building: 'ZACH',
  meetingDays: [false, true, false, true, false, false, false],
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSection1,
});

const testMeeting3 = new Meeting({
  id: 238732,
  building: 'ZACH',
  meetingDays: [true, false, true, false, true, false, false],
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 8,
  endTimeMinutes: 50,
  meetingType: MeetingType.LEC,
  section: testSection2,
});

const testMeeting4 = new Meeting({
  id: 384723,
  building: 'HELD',
  meetingDays: [false, true, false, true, false, false, false],
  startTimeHours: 11,
  startTimeMinutes: 10,
  endTimeHours: 12,
  endTimeMinutes: 25,
  meetingType: MeetingType.LEC,
  section: testSection3,
});

const testSectionA = new Section({
  id: 656565,
  crn: 656565,
  subject: 'BIOL',
  courseNum: '351',
  sectionNum: '200',
  minCredits: 4,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  instructor: new Instructor({ name: 'Deborah Seagle' }),
});

const testMeeting5 = new Meeting({
  id: 555555,
  building: 'BSBE',
  meetingDays: [false, true, false, true, false, true, false],
  startTimeHours: 9,
  startTimeMinutes: 10,
  endTimeHours: 10,
  endTimeMinutes: 0,
  meetingType: MeetingType.LEC,
  section: testSectionA,
});
const testMeeting6 = new Meeting({
  id: 666666,
  building: 'BSBE',
  meetingDays: [false, true, false, true, false, false, false],
  startTimeHours: 12,
  startTimeMinutes: 0,
  endTimeHours: 14,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSectionA,
});

const testSchedule1 = [testMeeting, testMeeting2, testMeeting3, testMeeting4];
const testSchedule2 = [testMeeting, testMeeting2, testMeeting5, testMeeting6];

// fetches the saved schedule for the user from the server
// currently mocks network traffic with
export default async function fetchSavedSchedule(): Promise<Meeting[][]> {
  return [testSchedule1, testSchedule2];
}
