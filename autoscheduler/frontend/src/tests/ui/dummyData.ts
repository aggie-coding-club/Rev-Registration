/* eslint-disable @typescript-eslint/camelcase */
export const dummySectionArgs = {
  id: 123456,
  crn: 123456,
  section_num: '501',
  min_credits: 0,
  max_credits: 0,
  current_enrollment: 0,
  max_enrollment: 0,
  honors: false,
  web: false,
  instructor_name: 'Aakash Tyagi',
  meetings: [] as any,
};

export const dummyMeetingArgs = {
  id: 12345,
  building: 'HRBB',
  days: [true, false, true, false, true, false, false],
  start: '08:00',
  end: '08:50',
  type: 'LEC',
};
