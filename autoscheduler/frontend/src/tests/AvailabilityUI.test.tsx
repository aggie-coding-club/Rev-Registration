import * as React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../redux/reducers';
import Schedule from '../components/Schedule/Schedule';
import * as styles from '../components/Schedule/Schedule.css';

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
      const mouseEventProps = {
        button: 0,
        clientY: 500,
      };
      // should create a 30-minute block starting at mid-day, or 14:30
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
      const startEventProps = {
        button: 0,
        clientY: 500,
      };
      const endEventProps = {
        button: 0,
        clientY: 700,
      };
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

    test('with an end time of 9 PM if dragged below that', () => {
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
        clientY: 600,
      };
      const endEventProps = {
        button: 0,
        clientY: 1200,
      };
      const expectedStart = '14:30';
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
      const startEventProps1 = {
        button: 0,
        clientY: 500,
      };
      const endEventProps1 = {
        button: 0,
        clientY: 700,
      };
      const endEventProps2 = {
        button: 0,
        clientY: 800,
      };
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
      const startEventProps = {
        clientY: 200,
      };
      const moveEventProps = {
        clientY: 0,
      };
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
      const startEventProps = {
        clientY: 200,
      };
      const moveEventProps = {
        clientY: 1200,
      };
      // if the time cursor was added, it would be added at 10:20
      const lateTime = '10:20';

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
      // ensures that all times are actually calculated based on mocked measurements
      expect(queryByText(/NaN/)).not.toBeInTheDocument();
    });
  });
});
