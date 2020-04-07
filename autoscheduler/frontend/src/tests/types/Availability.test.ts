import { createStore } from 'redux';
import Availability, { roundUpAvailability, AvailabilityArgs, AvailabilityType } from '../../types/Availability';
import autoSchedulerReducer from '../../redux/reducer';
import { addAvailability } from '../../redux/actions/availability';
import DayOfWeek from '../../types/DayOfWeek';

/**
 * Converts a pair of hours and minutes into a number of minutes past midnight
 */
const makeTime = (h: number, m: number): number => h * 60 + m;
const dummyArgs = {
  dayOfWeek: DayOfWeek.TUE,
  available: AvailabilityType.BUSY,
};

describe('roundUpAvailability()', () => {
  describe('keeps availabilities within bounds', () => {
    test('if the user starts before 8:30 and drags up', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        time1: makeTime(8, 20),
        time2: makeTime(8, 10),
      };
      const expectedResult: Availability[] = [{
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 8,
        endTimeMinutes: 30,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));

      // assert
      expect(store.getState().availability).toEqual(expectedResult);
    });

    test('if the user starts after 20:30 and drags down', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        ...dummyArgs,
        time1: makeTime(20, 40),
        time2: makeTime(20, 50),
      };
      const expectedResult: Availability[] = [{
        ...dummyArgs,
        startTimeHours: 20,
        startTimeMinutes: 30,
        endTimeHours: 21,
        endTimeMinutes: 0,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));

      // assert
      expect(store.getState().availability).toEqual(expectedResult);
    });
  });
  describe('expands in the direction of dragging', () => {
    test('if the user starts before 8:30 and drags down', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        time1: makeTime(8, 10),
        time2: makeTime(8, 20),
      };
      const expectedResult: Availability[] = [{
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        startTimeHours: 8,
        startTimeMinutes: 10,
        endTimeHours: 8,
        endTimeMinutes: 40,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));

      // assert
      expect(store.getState().availability).toEqual(expectedResult);
    });

    test('if the user starts after 20:30 and drags up', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        time1: makeTime(20, 50),
        time2: makeTime(20, 40),
      };
      const expectedResult: Availability[] = [{
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        startTimeHours: 20,
        startTimeMinutes: 20,
        endTimeHours: 20,
        endTimeMinutes: 50,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));

      // assert
      expect(store.getState().availability).toEqual(expectedResult);
    });

    test('if the user drags upward in the middle of the day', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        time1: makeTime(10, 20),
        time2: makeTime(10, 10),
      };
      const expectedResult: Availability[] = [{
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        startTimeHours: 9,
        startTimeMinutes: 50,
        endTimeHours: 10,
        endTimeMinutes: 20,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));

      // assert
      expect(store.getState().availability).toEqual(expectedResult);
    });
  });
});
