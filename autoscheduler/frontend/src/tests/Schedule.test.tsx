/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Meeting, { MeetingType } from '../types/Meeting';
import Section from '../types/Section';
import Instructor from '../types/Instructor';
import Schedule from '../components/Schedule/Schedule';
import autoSchedulerReducer from '../redux/reducer';

const testSection = new Section({
  id: 123456,
  crn: 123456,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '200',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
});

const testMeeting1 = new Meeting({
  id: 12345,
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
  const store = createStore(autoSchedulerReducer);
  const { container } = render(<Provider store={store}><Schedule /></Provider>);

  // assert
  expect(container).toBeTruthy();
});

test('Schedule with one meeting renders properly', () => {
  // arrange and act
  const store = createStore(autoSchedulerReducer, { meetings: [testMeeting1] });
  const { container } = render(
    <Provider store={store}>
      <Schedule />
    </Provider>,
  );

  // assert
  expect(container).toBeTruthy();
});
