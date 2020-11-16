import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import {
  render, fireEvent, queryByLabelText as queryByLabelTextIn, waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import Schedule from '../../components/SchedulingPage/Schedule/Schedule';
import { addAvailability } from '../../redux/actions/availability';
import DayOfWeek from '../../types/DayOfWeek';
import { AvailabilityType } from '../../types/Availability';
import { timeToEvent } from '../../utils/timeUtil';
import setTerm from '../../redux/actions/term';

describe('Adds availabilities across multiple days', () => {
  beforeEach(fetchMock.mockReset);

  describe('making 2 identical availabilities on Monday and Tuesday', () => {
    test('if the user starts on Monday, drags downward, then releases on Tuesday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByText, queryAllByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(14, 30);
      const endEventProps = timeToEvent(17, 10);
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
      startTimes.forEach(
        (startTime) => expect(startTime).toHaveAttribute('aria-valuetext', expectedStart),
      );

      const endTimes = queryAllByLabelText('Adjust End Time');
      endTimes.forEach(
        (endTime) => expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd),
      );
    });

    test('if the user starts on Monday, drags upward, then releases on Tuesday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByText, queryAllByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(17, 10);
      const endEventProps = timeToEvent(14, 30);
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
      startTimes.forEach(
        (startTime) => expect(startTime).toHaveAttribute('aria-valuetext', expectedStart),
      );

      const endTimes = queryAllByLabelText('Adjust End Time');
      endTimes.forEach(
        (endTime) => expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd),
      );
    });

    test('if the user drags from Monday to Thursday, but then releases on Tuesday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByText, queryAllByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(17, 10);
      const endEventProps = timeToEvent(14, 30);
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
      startTimes.forEach(
        (startTime) => expect(startTime).toHaveAttribute('aria-valuetext', expectedStart),
      );

      const endTimes = queryAllByLabelText('Adjust End Time');
      endTimes.forEach(
        (endTime) => expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd),
      );
    });

    test('if the user drags an existing availability on Tuesday into Monday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const { getByLabelText, queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(15, 0);
      const endEventProps = timeToEvent(16, 0);
      const expectedStart = '13:00';
      const expectedEnd = '16:00';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

      // Availabilities must be added after dealing with saved availabilties
      // add a pre-existing availability from 13:00 - 15:00 on Tue
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.TUE,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));

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
      const tuesday = getByLabelText('Tuesday');
      const monday = getByLabelText('Monday');
      fireEvent.mouseEnter(tuesday, startEventProps);
      fireEvent.mouseDown(tuesday, startEventProps);
      fireEvent.mouseMove(tuesday, startEventProps);
      fireEvent.mouseDown(getByLabelText('Adjust End Time'), startEventProps);
      fireEvent.mouseLeave(tuesday, startEventProps);
      fireEvent.mouseEnter(monday, startEventProps);
      fireEvent.mouseMove(monday, endEventProps);
      fireEvent.mouseUp(monday, endEventProps);

      // assert that the Mon availability has the same times as the Tue one
      const startTimeTue = queryByLabelTextIn(tuesday, 'Adjust Start Time');
      const startTimeMon = queryByLabelTextIn(monday, 'Adjust Start Time');
      expect(startTimeTue).toHaveAttribute('aria-valuetext', expectedStart);
      expect(startTimeTue).toEqual(startTimeMon);

      const endTimeTue = queryByLabelTextIn(tuesday, 'Adjust End Time');
      const endTimeMon = queryByLabelTextIn(monday, 'Adjust End Time');
      expect(endTimeTue).toHaveAttribute('aria-valuetext', expectedEnd);
      expect(endTimeTue).toEqual(endTimeMon);
    });
  });

  describe('making 3 identical availabilities on Mon, Tue, and Wed', () => {
    test('if the user starts on Monday, drags down, then jumps to Wednesday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByText, queryAllByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(14, 30);
      const endEventProps = timeToEvent(17, 10);
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
      startTimes.forEach(
        (startTime) => expect(startTime).toHaveAttribute('aria-valuetext', expectedStart),
      );

      const endTimes = queryAllByLabelText('Adjust End Time');
      endTimes.forEach(
        (endTime) => expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd),
      );
    });

    test('if the user starts on Wednesday, drags down, then jumps to Monday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByText, queryAllByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(14, 30);
      const endEventProps = timeToEvent(17, 10);
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
      startTimes.forEach(
        (startTime) => expect(startTime).toHaveAttribute('aria-valuetext', expectedStart),
      );

      const endTimes = queryAllByLabelText('Adjust End Time');
      endTimes.forEach(
        (endTime) => expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd),
      );
    });
  });

  describe('making 3 identical availabilities on Tue, Wed, and Thu, but not on Mon', () => {
    test('if the user drags from Thursday to Monday, but then releases on Tuesday', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByText, queryAllByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(17, 10);
      const endEventProps = timeToEvent(14, 30);
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
      startTimes.forEach(
        (startTime) => expect(startTime).toHaveAttribute('aria-valuetext', expectedStart),
      );

      const endTimes = queryAllByLabelText('Adjust End Time');
      endTimes.forEach(
        (endTime) => expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd),
      );
    });

    test('if the user drags to the left but then jumps to the right', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const { getAllByText, getByLabelText, queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(17, 10);
      const endEventProps = timeToEvent(14, 30);
      const expectedStart = '14:30';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

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
      fireEvent.mouseEnter(tuesday, startEventProps);
      fireEvent.mouseDown(tuesday, startEventProps);
      fireEvent.mouseMove(tuesday, endEventProps);
      fireEvent.mouseLeave(tuesday, endEventProps);
      fireEvent.mouseEnter(monday, endEventProps);
      fireEvent.mouseLeave(monday, endEventProps);
      fireEvent.mouseEnter(thursday, endEventProps);
      fireEvent.mouseUp(thursday, endEventProps);

      // assert that there are avs on TWR but not on M
      expect(getAllByText('BUSY')).toHaveLength(3);
      const startTimeMon = queryByLabelTextIn(monday, 'Adjust Start Time');
      const startTimeTue = queryByLabelTextIn(tuesday, 'Adjust Start Time');
      const startTimeThu = queryByLabelTextIn(thursday, 'Adjust Start Time');
      expect(startTimeMon).toBeFalsy();
      expect(startTimeTue).toHaveAttribute('aria-valuetext', expectedStart);
      expect(startTimeThu).toHaveAttribute('aria-valuetext', expectedStart);
    });
  });

  describe('making only one availability', () => {
    test('if the user starts, changes their mind, and goes back to a single day', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const {
        getAllByText, getByLabelText, queryByLabelText,
      } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(17, 10);
      const endEventProps = timeToEvent(14, 30);
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
        top: 0,
        bottom: 1000,
        left: 0,
        right: 200,
      }));

      // act
      const monday = getByLabelText('Monday');
      const tuesday = getByLabelText('Tuesday');
      fireEvent.mouseEnter(tuesday, startEventProps);
      fireEvent.mouseDown(tuesday, startEventProps);
      fireEvent.mouseMove(tuesday, endEventProps);
      fireEvent.mouseLeave(tuesday, endEventProps);
      fireEvent.mouseEnter(monday, endEventProps);
      fireEvent.mouseLeave(monday, endEventProps);
      fireEvent.mouseEnter(tuesday, endEventProps);
      fireEvent.mouseUp(tuesday, endEventProps);

      // assert that there is an av on Tue but not on Mon
      expect(getAllByText('BUSY')).toHaveLength(1);
      const startTime = queryByLabelText('Adjust Start Time');
      expect(startTime).toHaveAttribute('aria-valuetext', expectedStart);

      const endTime = queryByLabelText('Adjust End Time');
      expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd);
    });
  });

  describe('and merges with existing availabilities', () => {
    test('and merges if there is an existing availability that overlaps', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const { getByLabelText, queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(14, 30);
      const endEventProps = timeToEvent(17, 10);
      const expectedStart = '13:00';
      const expectedEnd = '17:10';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

      // Availabilities must be added after dealing with saved availabilties
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.TUE,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));

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

      // assert that Tue availability was merged correctly
      const startTime = queryByLabelTextIn(tuesday, 'Adjust Start Time');
      expect(startTime).toHaveAttribute('aria-valuetext', expectedStart);

      const endTime = queryByLabelTextIn(tuesday, 'Adjust End Time');
      expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd);
    });

    test('and merges if the user drags backward', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify([])); // sesssion/get_saved_availablities

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031')); // Must set the term for get_saved_availabilities to work

      const { getByLabelText, queryByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const startEventProps = timeToEvent(17, 10);
      const endEventProps = timeToEvent(14, 30);
      const expectedStart = '13:00';
      const expectedEnd = '17:10';

      // Wait for the loading indicator to be removed to continue
      await waitForElementToBeRemoved(
        () => queryByLabelText('availabilities-loading-indicator'),
      );

      // Availabilities must be added after dealing with saved availabilties
      // add a pre-existing availability from 13:00 - 15:00 on Mon thru Thurs
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.MON,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.TUE,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.WED,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.THU,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));

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
      const tuesday = getByLabelText('Tuesday');
      const wednesday = getByLabelText('Wednesday');
      fireEvent.mouseEnter(wednesday, startEventProps);
      fireEvent.mouseDown(wednesday, startEventProps);
      fireEvent.mouseMove(wednesday, endEventProps);
      fireEvent.mouseLeave(wednesday, endEventProps);
      fireEvent.mouseEnter(tuesday, endEventProps);
      fireEvent.mouseUp(tuesday, endEventProps);

      // assert that there Tue availability was merged correctly
      const startTime = queryByLabelTextIn(tuesday, 'Adjust Start Time');
      expect(startTime).toHaveAttribute('aria-valuetext', expectedStart);

      const endTime = queryByLabelTextIn(tuesday, 'Adjust End Time');
      expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd);
    });
  });
});
