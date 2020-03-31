import * as React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../redux/reducer';
import Schedule from '../components/SchedulingPage/Schedule/Schedule';
import * as styles from '../components/SchedulingPage/Schedule/Schedule.css';
import { FIRST_HOUR, LAST_HOUR } from '../timeUtil';

const timeToEvent = (h: number, m: number, offset = 0, clientHeight = 1000): {} => {
  const minsPastStart = h * 60 + m - FIRST_HOUR * 60;
  const minsPerDay = (LAST_HOUR - FIRST_HOUR) * 60;

  return {
    button: 0,
    clientY: offset + minsPastStart / minsPerDay * clientHeight,
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
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
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

      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
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

    test('with an end time of 9 PM and a size of 30 mins if dragged below the bottom', () => {
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
      };
      const endEventProps = {
        button: 0,
        clientY: 1200,
      };
      const expectedStart = '20:30';
      const expectedEnd = '21:00';
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      dayZero.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1100,
      }));

      // act
      const monday = getByLabelText('Monday');
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
      const expectedStart = '20:30';
      const expectedEnd = '21:00';
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      dayZero.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1100,
      }));

      // act
      const monday = getByLabelText('Monday');
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
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      dayZero.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1100,
      }));

      // act
      const monday = getByLabelText('Monday');
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
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
        .mockImplementation(() => 1000);

      // act
      const monday = getByLabelText('Monday');

      // make the first card
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
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      dayZero.getBoundingClientRect = jest.fn<any, any>(() => ({
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
      const dayZero = document.getElementsByClassName(styles.calendarDay)[0];
      jest.spyOn(dayZero, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      dayZero.getBoundingClientRect = jest.fn<any, any>(() => ({
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
