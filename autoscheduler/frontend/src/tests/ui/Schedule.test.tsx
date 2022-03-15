import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Schedule from '../../components/SchedulingPage/Schedule/Schedule';
import autoSchedulerReducer from '../../redux/reducer';
import { testSchedule3 } from '../testSchedules';
import { colors } from '../../components/SchedulingPage/Schedule/meetingColors';
import setTerm from '../../redux/actions/term';
import Availability from '../../types/Availability';

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
  remote: false,
  asynchronous: false,
  mcallen: false,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting1 = new Meeting({
  id: 12345,
  building: 'HRBB',
  meetingDays: [true, false, false, false, false, false, false],
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSection,
});

const testMeeting2 = new Meeting({
  id: 12346,
  building: 'HRBB',
  meetingDays: [true, false, false, false, false, false, false],
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 30,
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
        termData: {
          schedules: [
            {
              meetings: [testMeeting1],
              name: 'Schedule 1',
              locked: false,
            },
          ],
        },
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
        termData: {
          schedules: [
            {
              meetings: testSchedule3,
              name: 'Schedule 1',
              locked: false,
            },
          ],
        },
        selectedSchedule: 0,
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
          // select only the course name and number
          textContent: card.textContent.match(/\w+ \d+/)[0],
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

  describe('saved availabilities', () => {
    beforeEach(fetchMock.mockReset);

    test('loads in availabilities correctly', async () => {
      // arrange
      const savedAvails: Availability[] = [{
        available: 1,
        dayOfWeek: 0,
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 9,
        endTimeMinutes: 0,
      }];
      fetchMock.mockResponseOnce(JSON.stringify(savedAvails)); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      // act
      const { queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );

      // Wait for the loading indicator to be removed so we know the saved availabilities were
      // processed
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

      // assert
      expect(store.getState().termData.availability).toEqual(savedAvails);
    });

    describe('hides the loading indicator', () => {
      test('when session/get_saved_availabilities is done loading', async () => {
        // arrange
        fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

        const store = createStore(autoSchedulerReducer);
        store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

        // act
        const { queryByLabelText } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );

        // assert
        await waitFor(
          () => expect(queryByLabelText('availabilities-loading-indicator')).not.toBeInTheDocument(),
        );
      });
    });

    describe('re-shows the availabilities loading indicator', () => {
      test('when we set the term, it shows+disappears, then we change the term again', async () => {
        // arrange
        fetchMock.mockResponseOnce('[]'); // sessions_get_saved_availabilities
        fetchMock.mockResponseOnce('[]'); // sessions_get_saved_availabilities

        const store = createStore(autoSchedulerReducer);
        store.dispatch(setTerm('202031'));

        const { queryByLabelText } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );

        // wait for it to disappear once
        await waitForElementToBeRemoved(
          () => queryByLabelText('availabilities-loading-indicator'),
        );

        // act
        store.dispatch(setTerm('202111'));

        // assert
        await waitFor(
          () => expect(queryByLabelText('availabilities-loading-indicator')).toBeInTheDocument(),
        );
      });
    });
  });

  test('combines duplicate meetings', () => {
    // arrange
    const store = createStore(autoSchedulerReducer, {
      termData: {
        schedules: [
          {
            meetings: [testMeeting1, testMeeting2],
            name: 'Schedule 1',
            locked: false,
          },
        ],
      },
      selectedSchedule: 0,
    });

    // act
    const { getAllByText } = render(
      <Provider store={store}>
        <Schedule />
      </Provider>,
    );

    // assert
    const numMeetingCards = getAllByText('CSCE 121');
    expect(numMeetingCards.length).toEqual(1);
  });
});
