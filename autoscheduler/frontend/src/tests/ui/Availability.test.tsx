import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import Schedule from '../../components/SchedulingPage/Schedule/Schedule';
import { timeToEvent, LAST_HOUR } from '../../utils/timeUtil';
import setTerm from '../../redux/actions/term';

describe('Availability UI', () => {
  beforeEach(fetchMock.mockReset);

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('adds availability cards', () => {
    test('with a single click', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      // should create a 30-minute block starting at mid-day, or 14:30
      const mouseEventProps = timeToEvent(14, 30, 100);
      const expectedStart = '14:30';
      const expectedEnd = '15:00';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

      // mocks height of the calendar day as 1000
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

    test('with dragging', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(14, 30, 100);
      const endEventProps = timeToEvent(17, 10, 100);
      const expectedStart = '14:30';
      const expectedEnd = '17:10';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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

    test('with an end time of 10 PM and a size of 30 mins if dragged below the bottom', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
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

    test('with a size of 30 mins if barely dragged near the bottom', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

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

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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

    test('with a start time of 8 AM if dragged upward near the top', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

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

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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

    test('with a start time of 8 AM if the user drags out of the schedule and above the top', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getByText, getByLabelText, queryByText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(11, 0, 100);
      const leaveEventProps = timeToEvent(10, 0, 100);
      const endEventProps = timeToEvent(7, 0, 100);
      const expectedStart = '8:00';
      const expectedEnd = '11:00';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

      // mocking
      const meetingsContainer = document.getElementById('meetings-container');
      jest.spyOn(meetingsContainer, 'clientHeight', 'get')
        .mockImplementation(() => 1000);
      meetingsContainer.getBoundingClientRect = jest.fn<any, any>(() => ({
        top: 100,
        bottom: 1000,
        left: 0,
        right: 200,
      }));

      // act
      const monday = getByLabelText('Monday');
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

    test('if the user drags out of the schedule', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

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

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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
  });

  describe('doesn\'t override old cards', () => {
    test('when they end at the same time as a new one starts', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

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

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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
    test('if the time is before 8', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const { getByLabelText, queryByText, queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(9, 0, 100);
      const moveEventProps = timeToEvent(6, 40, 100);
      // if the time cursor was added, it would be added at 6:40
      const earlyTime = '6:40';

      // Wait for the loading indicator to be removed to continue
      // Not necessary for the tests to pass, but will cause an "update to Schedule inside a test
      // was not wrapped into act(..)"
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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

    test('if the time is after 9', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const { getByLabelText, queryByText, queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );

      // Wait for the loading indicator to be removed to continue
      // Not necessary for the tests to pass, but will cause an "update to Schedule inside a test
      // was not wrapped into act(..)"
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
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
