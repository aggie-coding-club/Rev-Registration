import * as React from 'react';
import {
  render, fireEvent, queryByLabelText as queryByLabelTextIn,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import Schedule from '../../components/SchedulingPage/Schedule/Schedule';
import { FIRST_HOUR, LAST_HOUR } from '../../timeUtil';
import { addAvailability } from '../../redux/actions/availability';
import DayOfWeek from '../../types/DayOfWeek';
import { AvailabilityType } from '../../types/Availability';

const timeToEvent = (h: number, m: number, offset = 0, clientHeight = 1000): {} => {
  const minsPastStart = h * 60 + m - FIRST_HOUR * 60;
  const minsPerDay = (LAST_HOUR - FIRST_HOUR) * 60;

  return {
    button: 0,
    clientY: offset + minsPastStart / minsPerDay * clientHeight,
    clientX: 100,
  };
};

describe('Availability UI', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('adds availability cards', () => {
    test('with a single click', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      // should create a 30-minute block starting at mid-day, or 14:30
      const mouseEventProps = timeToEvent(14, 30);
      const expectedStart = '14:30';
      const expectedEnd = '15:00';

      // mocks height of the calendar day as 1000
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseDown(monday, mouseEventProps);
      fireEvent.mouseUp(monday, mouseEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      // ensures that all times are actually calculated based on mocked measurements
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
      expect(queryByLabelText('Adjust End Time'))
        .toHaveAttribute('aria-valuetext', expectedEnd);
    });

    test('with dragging', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(14, 30);
      const endEventProps = timeToEvent(17, 10);
      const expectedStart = '14:30';
      const expectedEnd = '17:10';

      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseDown(monday, startEventProps);
      fireEvent.mouseMove(monday, endEventProps);
      fireEvent.mouseUp(monday, endEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
      expect(queryByLabelText('Adjust End Time'))
        .toHaveAttribute('aria-valuetext', expectedEnd);
    });

    test('with an end time of 10 PM and a size of 30 mins if dragged below the bottom', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = {
        button: 0,
        clientY: 1099,
        clientX: 100,
      };
      const endEventProps = {
        button: 0,
        clientY: 1200,
        clientX: 100,
      };
      const expectedStart = '21:30';
      const expectedEnd = '22:00';
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1100,
        left: 0,
        right: 200,
      }));

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseDown(monday, startEventProps);
      fireEvent.mouseMove(monday, startEventProps);
      fireEvent.mouseDown(queryByLabelText('Adjust End Time'), startEventProps);
      fireEvent.mouseMove(monday, endEventProps);
      fireEvent.mouseUp(monday, endEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
      expect(queryByLabelText('Adjust End Time'))
        .toHaveAttribute('aria-valuetext', expectedEnd);
    });

    test('with a size of 30 mins if barely dragged near the bottom', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(LAST_HOUR - 1, 40, 100);
      const endEventProps = timeToEvent(LAST_HOUR - 1, 50, 100);
      const expectedStart = '21:30';
      const expectedEnd = '22:00';
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1100,
        left: 0,
        right: 200,
      }));

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseDown(monday, startEventProps);
      fireEvent.mouseMove(monday, startEventProps);
      fireEvent.mouseDown(queryByLabelText('Adjust End Time'), startEventProps);
      fireEvent.mouseMove(monday, endEventProps);
      fireEvent.mouseUp(monday, endEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
      expect(queryByLabelText('Adjust End Time'))
        .toHaveAttribute('aria-valuetext', expectedEnd);
    });

    test('with a start time of 8 AM if dragged upward near the top', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(8, 20, 100);
      const endEventProps = timeToEvent(8, 10, 100);
      const expectedStart = '8:00';
      const expectedEnd = '8:30';
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1100,
        left: 0,
        right: 200,
      }));
      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseDown(monday, startEventProps);
      fireEvent.mouseMove(monday, startEventProps);
      fireEvent.mouseDown(getByLabelText('Adjust End Time'), startEventProps);
      fireEvent.mouseMove(monday, endEventProps);
      fireEvent.mouseUp(monday, endEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
      expect(queryByLabelText('Adjust End Time'))
        .toHaveAttribute('aria-valuetext', expectedEnd);
    });

    test('if the user drags out of the schedule', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(11, 0);
      const leaveEventProps = timeToEvent(10, 0);
      const endEventProps = timeToEvent(9, 0);
      const expectedStart = '9:00';
      const expectedEnd = '11:00';

      // mocking
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 0,
        bottom: 1000,
        left: 0,
        right: 200,
      }));

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseDown(monday, startEventProps);
      fireEvent.mouseMove(monday, startEventProps);
      fireEvent.mouseDown(getByLabelText('Adjust End Time'), startEventProps);
      fireEvent.mouseMove(monday, leaveEventProps);
      fireEvent.mouseLeave(monday, {
        ...leaveEventProps,
        clientX: -1, // mouse leaves calendar bounds
      });
      // mouse continues to move outside of calendar before releasing
      fireEvent.mouseMove(window, endEventProps);
      fireEvent.mouseUp(window, endEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
      expect(queryByLabelText('Adjust End Time'))
        .toHaveAttribute('aria-valuetext', expectedEnd);
    });

    describe('across multiple days', () => {
      test('if the user starts on Monday, drags downward, then releases on Tuesday', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const {
          getAllByText, getByLabelText, queryByText, queryAllByLabelText,
        } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(14, 30);
        const endEventProps = timeToEvent(17, 10);
        const expectedStart = '14:30';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const tuesday = getByLabelText('Tuesday');
        fireEvent.mouseEnter(monday, startEventProps);
        fireEvent.mouseDown(monday, startEventProps);
        fireEvent.mouseMove(monday, endEventProps);
        fireEvent.mouseLeave(monday, endEventProps);
        fireEvent.mouseEnter(tuesday, endEventProps);
        fireEvent.mouseUp(tuesday, endEventProps);

        // assert that there are 2 availabilities, both with the same times
        expect(getAllByText('BUSY')).toHaveLength(2);
        expect(queryByText(/NaN/)).not.toBeInTheDocument();

        const startTimes = queryAllByLabelText('Adjust Start Time');
        expect(startTimes[0]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[1]).toHaveAttribute('aria-valuetext', expectedStart);

        const endTimes = queryAllByLabelText('Adjust End Time');
        expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[1]).toHaveAttribute('aria-valuetext', expectedEnd);
      });

      test('if the user starts on Monday, drags upward, then releases on Tuesday', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const {
          getAllByText, getByLabelText, queryByText, queryAllByLabelText,
        } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(17, 10);
        const endEventProps = timeToEvent(14, 30);
        const expectedStart = '14:30';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const tuesday = getByLabelText('Tuesday');
        fireEvent.mouseEnter(monday, startEventProps);
        fireEvent.mouseDown(monday, startEventProps);
        fireEvent.mouseMove(monday, endEventProps);
        fireEvent.mouseLeave(monday, endEventProps);
        fireEvent.mouseEnter(tuesday, endEventProps);
        fireEvent.mouseUp(tuesday, endEventProps);

        // assert that there are 2 availabilities, both with the same times
        expect(getAllByText('BUSY')).toHaveLength(2);
        expect(queryByText(/NaN/)).not.toBeInTheDocument();

        const startTimes = queryAllByLabelText('Adjust Start Time');
        expect(startTimes[0]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[1]).toHaveAttribute('aria-valuetext', expectedStart);

        const endTimes = queryAllByLabelText('Adjust End Time');
        expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[1]).toHaveAttribute('aria-valuetext', expectedEnd);
      });

      test('if the user starts on Monday, drags down, then jumps to Wednesday', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const {
          getAllByText, getByLabelText, queryByText, queryAllByLabelText,
        } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(14, 30);
        const endEventProps = timeToEvent(17, 10);
        const expectedStart = '14:30';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const wednesday = getByLabelText('Wednesday');
        fireEvent.mouseEnter(monday, startEventProps);
        fireEvent.mouseDown(monday, startEventProps);
        fireEvent.mouseMove(monday, endEventProps);
        fireEvent.mouseLeave(monday, endEventProps);
        fireEvent.mouseEnter(wednesday, endEventProps);
        fireEvent.mouseUp(wednesday, endEventProps);

        // assert that there are 3 availabilities, all with the same times
        expect(getAllByText('BUSY')).toHaveLength(3);
        expect(queryByText(/NaN/)).not.toBeInTheDocument();

        const startTimes = queryAllByLabelText('Adjust Start Time');
        expect(startTimes[0]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[1]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[2]).toHaveAttribute('aria-valuetext', expectedStart);

        const endTimes = queryAllByLabelText('Adjust End Time');
        expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[1]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[2]).toHaveAttribute('aria-valuetext', expectedEnd);
      });

      test('if the user starts on Wednesday, drags down, then jumps to Monday', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const {
          getAllByText, getByLabelText, queryByText, queryAllByLabelText,
        } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(14, 30);
        const endEventProps = timeToEvent(17, 10);
        const expectedStart = '14:30';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const wednesday = getByLabelText('Wednesday');
        fireEvent.mouseEnter(wednesday, startEventProps);
        fireEvent.mouseDown(wednesday, startEventProps);
        fireEvent.mouseMove(wednesday, endEventProps);
        fireEvent.mouseLeave(wednesday, endEventProps);
        fireEvent.mouseEnter(monday, endEventProps);
        fireEvent.mouseUp(monday, endEventProps);

        // assert that there are 3 availabilities, all with the same times
        expect(getAllByText('BUSY')).toHaveLength(3);
        expect(queryByText(/NaN/)).not.toBeInTheDocument();

        const startTimes = queryAllByLabelText('Adjust Start Time');
        expect(startTimes[0]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[1]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[2]).toHaveAttribute('aria-valuetext', expectedStart);

        const endTimes = queryAllByLabelText('Adjust End Time');
        expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[1]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[2]).toHaveAttribute('aria-valuetext', expectedEnd);
      });

      test('if the user drags from Monday to Thursday, but then releases on Tuesday', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const {
          getAllByText, getByLabelText, queryByText, queryAllByLabelText,
        } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(17, 10);
        const endEventProps = timeToEvent(14, 30);
        const expectedStart = '14:30';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const tuesday = getByLabelText('Tuesday');
        const thursday = getByLabelText('Thursday');
        fireEvent.mouseEnter(monday, startEventProps);
        fireEvent.mouseDown(monday, startEventProps);
        fireEvent.mouseMove(monday, endEventProps);
        fireEvent.mouseLeave(monday, endEventProps);
        fireEvent.mouseEnter(thursday, endEventProps);
        fireEvent.mouseLeave(thursday, endEventProps);
        fireEvent.mouseEnter(tuesday, endEventProps);
        fireEvent.mouseUp(tuesday, endEventProps);

        // assert that there are 2 availabilities, both with the same times
        expect(getAllByText('BUSY')).toHaveLength(2);
        expect(queryByText(/NaN/)).not.toBeInTheDocument();

        const startTimes = queryAllByLabelText('Adjust Start Time');
        expect(startTimes[0]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[1]).toHaveAttribute('aria-valuetext', expectedStart);

        const endTimes = queryAllByLabelText('Adjust End Time');
        expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[1]).toHaveAttribute('aria-valuetext', expectedEnd);
      });

      test('if the user drags from Thurday to Monday, but then releases on Tuesday', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const {
          getAllByText, getByLabelText, queryByText, queryAllByLabelText,
        } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(17, 10);
        const endEventProps = timeToEvent(14, 30);
        const expectedStart = '14:30';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const tuesday = getByLabelText('Tuesday');
        const thursday = getByLabelText('Thursday');
        fireEvent.mouseEnter(thursday, startEventProps);
        fireEvent.mouseDown(thursday, startEventProps);
        fireEvent.mouseMove(thursday, endEventProps);
        fireEvent.mouseLeave(thursday, endEventProps);
        fireEvent.mouseEnter(monday, endEventProps);
        fireEvent.mouseLeave(monday, endEventProps);
        fireEvent.mouseEnter(tuesday, endEventProps);
        fireEvent.mouseUp(tuesday, endEventProps);

        // assert that there are 2 availabilities, both with the same times
        expect(getAllByText('BUSY')).toHaveLength(3);
        expect(queryByText(/NaN/)).not.toBeInTheDocument();

        const startTimes = queryAllByLabelText('Adjust Start Time');
        expect(startTimes[0]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[1]).toHaveAttribute('aria-valuetext', expectedStart);
        expect(startTimes[2]).toHaveAttribute('aria-valuetext', expectedStart);

        const endTimes = queryAllByLabelText('Adjust End Time');
        expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[1]).toHaveAttribute('aria-valuetext', expectedEnd);
        expect(endTimes[2]).toHaveAttribute('aria-valuetext', expectedEnd);
      });

      test('and merges if there is an existing availability that overlaps', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(addAvailability({
          dayOfWeek: DayOfWeek.TUE,
          available: AvailabilityType.BUSY,
          time1: 13 * 60 + 0,
          time2: 15 * 60 + 0,
        }));
        const { getByLabelText } = render(
          <Provider store={store}>
            <Schedule />
          </Provider>,
        );
        const startEventProps = timeToEvent(14, 30);
        const endEventProps = timeToEvent(17, 10);
        const expectedStart = '13:00';
        const expectedEnd = '17:10';

        const meetingsContainer = document.getElementById('meetings-container');
        jest.spyOn(meetingsContainer, 'clientHeight', 'get')
          .mockImplementation(() => 1000);
        meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
          top: 0,
          bottom: 1000,
          left: 0,
          right: 200,
        }));

        // act
        const monday = getByLabelText('Monday');
        const tuesday = getByLabelText('Tuesday');
        const wednesday = getByLabelText('Wednesday');
        fireEvent.mouseEnter(monday, startEventProps);
        fireEvent.mouseDown(monday, startEventProps);
        fireEvent.mouseMove(monday, endEventProps);
        fireEvent.mouseLeave(monday, endEventProps);
        fireEvent.mouseEnter(wednesday, endEventProps);
        fireEvent.mouseUp(wednesday, endEventProps);

        // assert that there are 3 availabilities, all with the same times
        const startTime = queryByLabelTextIn(tuesday, 'Adjust Start Time');
        expect(startTime).toHaveAttribute('aria-valuetext', expectedStart);

        const endTime = queryByLabelTextIn(tuesday, 'Adjust End Time');
        expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd);
      });
    });
  });

  describe('doesn\'t override old cards', () => {
    test('when they end at the same time as a new one starts', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps1 = timeToEvent(14, 30);
      const endEventProps1 = timeToEvent(17, 10);
      const endEventProps2 = timeToEvent(18, 0);
      // the start time should be defined by the event at y = 500
      const expectedStart = '14:30';

      // mock the height of the calendar day
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 0,
        bottom: 1000,
        left: 0,
        right: 200,
      }));

      // act
      const monday = getByLabelText('Monday');

      // make the first card
      fireEvent.mouseEnter(monday, startEventProps1);
      fireEvent.mouseDown(monday, startEventProps1);
      fireEvent.mouseMove(monday, endEventProps1);
      fireEvent.mouseUp(monday, endEventProps1);

      // make the second card
      fireEvent.mouseDown(monday, endEventProps1);
      fireEvent.mouseMove(monday, endEventProps1);
      fireEvent.mouseMove(monday, endEventProps2);
      fireEvent.mouseUp(monday, endEventProps2);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
      expect(queryByLabelText('Adjust Start Time'))
        .toHaveAttribute('aria-valuetext', expectedStart);
    });
  });

  describe('doesn\'t show the time cursor', () => {
    test('if the time is before 8', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByLabelText, queryByText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(9, 0, 100);
      const moveEventProps = timeToEvent(6, 40, 100);
      // if the time cursor was added, it would be added at 6:40
      const earlyTime = '6:40';

      // mocks height of the calendar day as 1000 and top of calendar day at 100 px
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
      }));

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseMove(monday, moveEventProps);

      // assert
      expect(queryByText(earlyTime)).toBeFalsy();
      // ensures that all times are actually calculated based on mocked measurements
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
    });

    test('if the time is after 9', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByLabelText, queryByText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(9, 0, 100);
      const moveEventProps = timeToEvent(20, 20, 100);
      // if the time cursor was added, it would be added at 10:20 PM
      const lateTime = '10:20';
      const lateTimeAlt = '20:20'; // just in case it's accidentally in 24-hr time

      // mocks height of the calendar day as 1000 and top of calendar day at 100 px
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1000,
      }));

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseMove(monday, moveEventProps);

      // assert
      expect(queryByText(lateTime)).toBeFalsy();
      expect(queryByText(lateTimeAlt)).toBeFalsy();
      // ensures that all times are actually calculated based on mocked measurements
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
    });
  });
});
