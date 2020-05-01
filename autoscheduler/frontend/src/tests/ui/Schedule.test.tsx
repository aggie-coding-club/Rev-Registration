/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Schedule from '../../components/SchedulingPage/Schedule/Schedule';
import autoSchedulerReducer from '../../redux/reducer';
import { testSchedule3 } from '../testSchedules';
import colors from '../../components/SchedulingPage/Schedule/meetingColors';

const testSection = new Section({
  id: 123456,
  crn: 123456,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '200',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 0,
  honors: false,
  web: false,
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

describe('Schedule UI', () => {
  describe('renders without errors', () => {
    test('when given an empty schedule', () => {
      // arrange and act
      const store = createStore(autoSchedulerReducer);
      const { container } = render(<Provider store={store}><Schedule /></Provider>);

      // assert
      expect(container).toBeTruthy();
    });

    test('when given a schedule with 1 meeting', () => {
      // arrange and act
      const store = createStore(autoSchedulerReducer, {
        schedules: [[testMeeting1]], selectedSchedule: 0,
      });
      const { container } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );

      // assert
      expect(container).toBeTruthy();
    });
  });

  describe('uses unique colors', () => {
    test('for up to 10 different sections', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, {
        schedules: [testSchedule3], selectedSchedule: 0,
      });
      const { getAllByTestId } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      // as a pre-condition for this test to make sense, the test schedule cannot have
      // more than unique sections than the number of unique colors
      const uniqueSections = new Set(testSchedule3.map((mtg) => mtg.section.id));
      expect(uniqueSections.size).toBeLessThanOrEqual(colors.length);

      // act
      const cardEls = getAllByTestId('meeting-card-primary-content');
      const meetingCards = cardEls.map((card) => {
        // find the colored element that is a parent of the div with text
        let coloredEl = card;
        while (!coloredEl.style.backgroundColor) coloredEl = coloredEl.parentElement;

        return {
          backgroundColor: coloredEl.style.backgroundColor,
          textContent: card.textContent,
        };
      });

      // assert that no other card has the same style unless it has the same text
      meetingCards.forEach((card) => {
        meetingCards.forEach((other) => {
          if (card.backgroundColor === other.backgroundColor) {
            expect(card.textContent).toBe(other.textContent);
          }
        });
      });
    });
  });
});
