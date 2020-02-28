import { createStore } from 'redux';
import autoSchedulerReducer from '../redux/reducers';
import {
  addAvailability,
  deleteAvailability,
  updateAvailability,
} from '../redux/actions';
import 'isomorphic-fetch';
import { AvailabilityType, argsToAvailability } from '../types/Availability';
import DayOfWeek from '../types/DayOfWeek';

/**
 * Converts a pair of hours and minutes into a number of minutes past midnight
 */
const makeTime = (h: number, m: number): number => h * 60 + m;
/**
 * Makes availabilities "Busy on Wednesday", since that part isn't being tested
 */
const dummyArgs = {
  available: AvailabilityType.BUSY,
  dayOfWeek: DayOfWeek.WED,
};
describe('Availabilities', () => {
  describe('of the same type are merged', () => {
    test('with an overlap on one end', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(8, 0),
        time2: makeTime(12, 0),
      };
      const availability2 = {
        ...dummyArgs,
        time1: makeTime(11, 30),
        time2: makeTime(13, 42),
      };
      const mergedAvailability = [{
        ...dummyArgs,
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 13,
        endTimeMinutes: 42,
      }];

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(addAvailability(availability2));

      // assert
      expect(store.getState().availability).toEqual(mergedAvailability);
    });
    test('with overlaps on both ends', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(11, 30),
        time2: makeTime(13, 42),
      };
      const availability2 = {
        ...dummyArgs,
        time1: makeTime(7, 0),
        time2: makeTime(8, 30),
      };
      const availability3 = {
        ...dummyArgs,
        time1: makeTime(8, 0),
        time2: makeTime(12, 0),
      };
      const mergedAvailability = [{
        ...dummyArgs,
        startTimeHours: 7,
        startTimeMinutes: 0,
        endTimeHours: 13,
        endTimeMinutes: 42,
      }];

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(addAvailability(availability2));
      store.dispatch(addAvailability(availability3));

      // assert
      expect(store.getState().availability).toEqual(mergedAvailability);
    });
  });

  describe('are not merged', () => {
    test('when they don\'t overlap', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(8, 0),
        time2: makeTime(12, 0),
      };
      const availability2 = {
        ...dummyArgs,
        time1: makeTime(12, 30),
        time2: makeTime(13, 42),
      };
      const expected = [argsToAvailability(availability1), argsToAvailability(availability2)];

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(addAvailability(availability2));

      // assert
      expect(store.getState().availability).toEqual(expected);
    });
  });

  describe('are deleted', () => {
    test('after they are added, without being updated', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(8, 0),
        time2: makeTime(12, 0),
      };

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(deleteAvailability(availability1));

      // assert
      expect(store.getState().availability).toHaveLength(0);
    });
  });

  describe('are updated', () => {
    test('after changes to both start and end times', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(8, 0),
        time2: makeTime(9, 0),
      };
      const expected = [{
        ...dummyArgs,
        startTimeHours: 8,
        startTimeMinutes: 20,
        endTimeHours: 8,
        endTimeMinutes: 50,
      }];

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(updateAvailability({
        ...availability1,
        time2: makeTime(8, 50),
      }));
      store.dispatch(updateAvailability({
        ...dummyArgs,
        time1: makeTime(8, 50),
        time2: makeTime(8, 20),
      }));

      // assert
      expect(store.getState().availability).toEqual(expected);
    });
  });
});
