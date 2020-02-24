import { createStore } from 'redux';
import autoSchedulerReducer from '../redux/reducers';
import {
  addAvailability,
  deleteAvailability,
  updateAvailability,
} from '../redux/actions';
import 'isomorphic-fetch';
import Availability, { AvailabilityType, argsToAvailability } from '../types/Availability';
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

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(addAvailability(availability2));

      // assert
      expect(store.getState().availability).toEqual([{
        available: AvailabilityType.BUSY,
        dayOfWeek: DayOfWeek.WED,
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 13,
        endTimeMinutes: 42,
      }]);
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
        available: AvailabilityType.BUSY,
        dayOfWeek: DayOfWeek.WED,
        time1: makeTime(8, 0),
        time2: makeTime(12, 0),
      };

      // act
      store.dispatch(addAvailability(availability1));
      store.dispatch(addAvailability(availability2));
      store.dispatch(addAvailability(availability3));

      // assert
      expect(store.getState().availability).toEqual([{
        available: AvailabilityType.BUSY,
        dayOfWeek: DayOfWeek.WED,
        startTimeHours: 7,
        startTimeMinutes: 0,
        endTimeHours: 13,
        endTimeMinutes: 42,
      }]);
    });
  });

  test('that don\'t overlap are not merged', () => {
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

    // act
    store.dispatch(addAvailability(availability1));
    store.dispatch(addAvailability(availability2));

    // assert
    expect(store.getState().availability).toEqual(
      [argsToAvailability(availability1), argsToAvailability(availability2)],
    );
  });

  test('are deleted', () => {
    // arrange
    const store = createStore(autoSchedulerReducer);
    const availability1 = {
      ...dummyArgs,
      time1: makeTime(8, 0),
      time2: makeTime(12, 0),
    };

    // act
    store.dispatch(addAvailability(availability1));
    const intermediateState = store.getState().availability;
    store.dispatch(deleteAvailability(availability1));

    // assert
    expect(intermediateState).toHaveLength(1);
    expect(store.getState().availability).toHaveLength(0);
  });

  test('are updated', () => {
    // arrange
    const store = createStore(autoSchedulerReducer);
    const availability1 = {
      ...dummyArgs,
      time1: makeTime(8, 0),
      time2: makeTime(9, 0),
    };

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
    expect(store.getState().availability).toEqual<Availability[]>([{
      available: AvailabilityType.BUSY,
      dayOfWeek: DayOfWeek.WED,
      startTimeHours: 8,
      startTimeMinutes: 20,
      endTimeHours: 8,
      endTimeMinutes: 50,
    }]);
  });
});
