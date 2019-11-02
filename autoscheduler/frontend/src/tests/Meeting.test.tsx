import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import MeetingCard from '../components/MeetingCard';
import { Meeting, MeetingType, Section } from '../types';

const testSection: Section = {
  id: 123456,
  subject: 'CSCE',
  courseNum: 121,
  sectionNum: 200,
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  instructor: 123456,
};

const testMeeting: Meeting = {
  id: 12345,
  crn: 123456,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 18,
  endTimeMinutes: 50,
  meetingType: MeetingType.LEC,
  section: testSection,
};

test('accepts meeting as props', () => {
  const { container } = render(<MeetingCard meeting={testMeeting} />);
  expect(container).toBeTruthy();
});

test('displays subject and course number', () => {
  const { getByText } = render(<MeetingCard meeting={testMeeting} />);
  expect(getByText(/CSCE/)).toBeTruthy();
  expect(getByText(/121/)).toBeTruthy();
});

test('subject and course number can adapt to random values', () => {
  // arrange
  const randSubject = new Array(5).reduce((acc) => acc + String.fromCharCode(
    Math.floor(65 + Math.random() * 26),
  ));
  const randCourseNum = Math.floor(100 + Math.random() * 400);
  const randMeeting: Meeting = {
    ...testMeeting,
    section: {
      ...testMeeting.section,
      subject: randSubject,
      courseNum: randCourseNum,
    },
  };

  // act
  const { getByText } = render(<MeetingCard meeting={randMeeting} />);

  // assert
  expect(getByText(randSubject)).toBeTruthy();
  expect(getByText(randCourseNum.toString())).toBeTruthy();
});
