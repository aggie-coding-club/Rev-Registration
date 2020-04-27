import { createStore } from 'redux';
import autoSchedulerReducer from '../../redux/reducer';
import {
  addAvailability,
  deleteAvailability,
  updateAvailability,
  mergeAvailability,
} from '../../redux/actions/availability';
import 'isomorphic-fetch';
import Availability, { AvailabilityType, argsToAvailability, AvailabilityArgs } from '../../types/Availability';
import DayOfWeek from '../../types/DayOfWeek';

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
      const expected = [{
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
      expect(store.getState().availability).toEqual(expected);
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
      const expected = [{
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
      expect(store.getState().availability).toEqual(expected);
    });

    test('only once when 3 or more coincide', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(13, 0),
        time2: makeTime(14, 0),
      };
      const availability2 = {
        ...dummyArgs,
        time1: makeTime(15, 0),
        time2: makeTime(16, 0),
      };
      const availability3 = {
        ...dummyArgs,
        time1: makeTime(17, 0),
        time2: makeTime(17, 30),
      };
      const availability4 = {
        ...dummyArgs,
        time1: makeTime(18, 0),
        time2: makeTime(18, 30),
      };
      const availability5 = {
        ...dummyArgs,
        time1: makeTime(12, 0),
        time2: makeTime(12, 0),
      };
      const availability5New = {
        ...dummyArgs,
        time1: makeTime(12, 0),
        time2: makeTime(15, 30),
      };
      const expected: Availability[] = [
        {
          ...dummyArgs,
          startTimeHours: 17,
          startTimeMinutes: 0,
          endTimeHours: 17,
          endTimeMinutes: 30,
        },
        {
          ...dummyArgs,
          startTimeHours: 18,
          startTimeMinutes: 0,
          endTimeHours: 18,
          endTimeMinutes: 30,
        },
        {
          ...dummyArgs,
          startTimeHours: 12,
          startTimeMinutes: 0,
          endTimeHours: 16,
          endTimeMinutes: 0,
        },
      ];

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(addAvailability(availability2));
      store.dispatch(addAvailability(availability3));
      store.dispatch(addAvailability(availability4));
      store.dispatch(addAvailability(availability5));
      store.dispatch(updateAvailability(availability5New));
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().availability).toEqual(expected);
    });

    test('when dragging an old availability', () => {
      // arrrange
      const preloadedState = {
        availability: [{
          ...dummyArgs,
          startTimeHours: 17,
          startTimeMinutes: 40,
          endTimeHours: 18,
          endTimeMinutes: 10,
        }, {
          ...dummyArgs,
          startTimeHours: 17,
          startTimeMinutes: 40,
          endTimeHours: 18,
          endTimeMinutes: 50,
        }, {
          ...dummyArgs,
          startTimeHours: 13,
          startTimeMinutes: 0,
          endTimeHours: 17,
          endTimeMinutes: 10,
        }],
      };
      const store = createStore(autoSchedulerReducer, preloadedState);
      const updateArgs: AvailabilityArgs = {
        ...dummyArgs,
        time1: makeTime(18, 50),
        time2: makeTime(17, 30),
      };
      const expectedAv1 = {
        ...dummyArgs,
        startTimeHours: 17,
        startTimeMinutes: 30,
        endTimeHours: 18,
        endTimeMinutes: 50,
      };
      const expectedAv2 = {
        ...dummyArgs,
        startTimeHours: 13,
        startTimeMinutes: 0,
        endTimeHours: 17,
        endTimeMinutes: 10,
      };

      // act
      store.dispatch(updateAvailability(updateArgs));
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().availability).toHaveLength(2);
      expect(store.getState().availability).toContainEqual(expectedAv1);
      expect(store.getState().availability).toContainEqual(expectedAv2);
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
