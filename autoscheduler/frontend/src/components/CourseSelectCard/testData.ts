import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';

export default async function fetch(route: string): Promise<Response> {
  const course = /\/api\/(.+)\/meetings/.exec(route);
  const testSection1 = new Section({
    id: 123456,
    subject: course[1].split('%20')[0],
    courseNum: Number.parseInt(course[1].split('%20')[1], 10),
    sectionNum: 501,
    minCredits: 0,
    maxCredits: 0,
    currentEnrollment: 0,
    instructor: new Instructor({
      name: 'Aakash Tyagi',
    }),
  });
  const testSection2 = new Section({
    id: 123457,
    subject: course[1].split('%20')[0],
    courseNum: Number.parseInt(course[1].split('%20')[1], 10),
    sectionNum: 502,
    minCredits: 0,
    maxCredits: 0,
    currentEnrollment: 0,
    instructor: new Instructor({
      name: 'Somebody Else',
    }),
  });
  return new Response(JSON.stringify([
    new Meeting({
      id: 12345,
      crn: 123456,
      building: 'HRBB',
      meetingDays: new Array(7).fill(true),
      startTimeHours: 8,
      startTimeMinutes: 0,
      endTimeHours: 8,
      endTimeMinutes: 50,
      meetingType: MeetingType.LEC,
      section: testSection1,
    }),
    new Meeting({
      id: 12346,
      crn: 123456,
      building: 'ZACH',
      meetingDays: [false, false, true, false, false, false, false],
      startTimeHours: 11,
      startTimeMinutes: 10,
      endTimeHours: 12,
      endTimeMinutes: 25,
      meetingType: MeetingType.LAB,
      section: testSection1,
    }),
    new Meeting({
      id: 12347,
      crn: 123457,
      building: 'ZACH',
      meetingDays: [false, true, false, true, false, true, false],
      startTimeHours: 11,
      startTimeMinutes: 10,
      endTimeHours: 12,
      endTimeMinutes: 25,
      meetingType: MeetingType.LEC,
      section: testSection2,
    }),
  ]));
}
