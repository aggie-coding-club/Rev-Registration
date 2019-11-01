import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import MeetingCard from '../components/MeetingCard';
import Meeting, { MeetingType } from '../types/Meeting';
import Section from '../types/Section';
import Instructor from '../types/Instructor';

const testSection = new Section({
  id: 123456,
  subject: 'CSCE',
  courseNum: 121,
  sectionNum: 200,
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  instructor: new Instructor({
    id: 123456,
    name: 'Aakash Tyagi',
  }),
});

const testMeeting = new Meeting({
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
});

test('accepts meeting and color as props', () => {
  const { container } = render(<MeetingCard meeting={testMeeting} bgColor="#500000" />);
  expect(container).toBeTruthy();
});

test('displays subject and course number', () => {
  const { getByText } = render(<MeetingCard meeting={testMeeting} bgColor="#500000" />);
  expect(getByText(/CSCE/)).toBeTruthy();
  expect(getByText(/121/)).toBeTruthy();
});

test('displays meeting type', () => {
  const { getByText } = render(<MeetingCard meeting={testMeeting} bgColor="#500000" />);
  expect(getByText(/LEC/i)).toBeTruthy();
});
