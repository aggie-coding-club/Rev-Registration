/* eslint-disable no-undef */
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import Meeting, { MeetingType } from '../types/Meeting';
import Section from '../types/Section';
import Instructor from '../types/Instructor';
import Schedule from '../components/Schedule/Schedule';

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

const testMeeting1 = new Meeting({
  id: 12345,
  crn: 123456,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSection,
});

test('Empty schedule renders properly', () => {
  // arrange and act
  const { container } = render(<Schedule meetings={[]} />);

  // assert
  expect(container).toBeTruthy();
});

test('Time labels appear and disappear', () => {
  // arrange
  const { getByText, getAllByText } = render(<Schedule meetings={[testMeeting1]} />);

  // act
  const { subject, courseNum, sectionNum } = testMeeting1.section;
  const meetingCard1 = getAllByText(`${subject} ${courseNum}-${sectionNum}`)[0];
  fireEvent.mouseEnter(meetingCard1.parentElement.parentElement);
  const timeView2 = getByText(`${testMeeting1.startTimeHours}:${testMeeting1.startTimeMinutes}`);
  fireEvent.mouseLeave(meetingCard1.parentElement.parentElement);

  // assert
  expect(meetingCard1).toBeTruthy();
  expect(() => {
    getByText(`${testMeeting1.startTimeHours}:${testMeeting1.startTimeMinutes}`);
  }).toThrow();
  expect(timeView2).toBeTruthy();
});
