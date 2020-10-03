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
import { addAvailability } from '../../redux/actions/availability';
import DayOfWeek from '../../types/DayOfWeek';
import { AvailabilityType } from '../../types/Availability';
import { timeToEvent } from '../../utils/timeUtil';

describe('Adds availabilities across multiple days', () => {
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

  test('if the user drags from Thursday to Monday, but then releases on Tuesday', () => {
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

  test('if the user drags in one direction and then jumps to the other direction', () => {
    // arrange
    const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
    const {
      getAllByText, getByLabelText, queryAllByLabelText,
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

    const endTimes = queryAllByLabelText('Adjust End Time');
    expect(endTimes[0]).toHaveAttribute('aria-valuetext', expectedEnd);
  });

  test('if the user starts changes their mind and goes back to a single day', () => {
    // arrange
    const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
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

  test('and merges if the user drags backward', () => {
    // arrange
    const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
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
    const { getByLabelText } = render(
      <Provider store={store}>
        <Schedule />
      </Provider>,
    );
    const startEventProps = timeToEvent(17, 10);
    const endEventProps = timeToEvent(14, 30);
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
    const tuesday = getByLabelText('Tuesday');
    const wednesday = getByLabelText('Wednesday');
    fireEvent.mouseEnter(wednesday, startEventProps);
    fireEvent.mouseDown(wednesday, startEventProps);
    fireEvent.mouseMove(wednesday, endEventProps);
    fireEvent.mouseLeave(wednesday, endEventProps);
    fireEvent.mouseEnter(tuesday, endEventProps);
    fireEvent.mouseUp(tuesday, endEventProps);

    // assert that there are 3 availabilities, all with the same times
    const startTime = queryByLabelTextIn(tuesday, 'Adjust Start Time');
    expect(startTime).toHaveAttribute('aria-valuetext', expectedStart);

    const endTime = queryByLabelTextIn(tuesday, 'Adjust End Time');
    expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd);
  });

  test('if the user drags an existing availability into a multi-day availability', () => {
    // arrange
    const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
    // add a pre-existing availability from 13:00 - 15:00 on Tue
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
    const startEventProps = timeToEvent(15, 0);
    const endEventProps = timeToEvent(16, 0);
    const expectedStart = '13:00';
    const expectedEnd = '16:00';

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
    fireEvent.mouseEnter(tuesday, startEventProps);
    fireEvent.mouseDown(tuesday, startEventProps);
    fireEvent.mouseMove(tuesday, startEventProps);
    fireEvent.mouseDown(getByLabelText('Adjust End Time'), startEventProps);
    fireEvent.mouseLeave(tuesday, startEventProps);
    fireEvent.mouseEnter(wednesday, startEventProps);
    fireEvent.mouseMove(wednesday, endEventProps);
    fireEvent.mouseUp(wednesday, endEventProps);

    // assert that the Wed availability has the same times as the Tue one
    const startTime = queryByLabelTextIn(wednesday, 'Adjust Start Time');
    expect(startTime).toHaveAttribute('aria-valuetext', expectedStart);

    const endTime = queryByLabelTextIn(wednesday, 'Adjust End Time');
    expect(endTime).toHaveAttribute('aria-valuetext', expectedEnd);
  });
});
