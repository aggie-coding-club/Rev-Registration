import { createStore } from 'redux';
import Availability, { roundUpAvailability, AvailabilityArgs, AvailabilityType } from '../../types/Availability';
import autoSchedulerReducer from '../../redux/reducer';
import { addAvailability, mergeAvailability } from '../../redux/actions/availability';
import DayOfWeek from '../../types/DayOfWeek';
import { FIRST_HOUR, LAST_HOUR } from '../../utils/timeUtil';

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
    test('if the user starts before 7:30 and drags up', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        time1: makeTime(FIRST_HOUR, 20),
        time2: makeTime(FIRST_HOUR, 10),
      };
      const expectedResult: Availability[] = [{
        dayOfWeek: 2,
        available: AvailabilityType.BUSY,
        startTimeHours: FIRST_HOUR,
        startTimeMinutes: 0,
        endTimeHours: FIRST_HOUR,
        endTimeMinutes: 30,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expectedResult);
    });

    test('if the user starts within 30 minutes of the last hour and drags down', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const avArgs: AvailabilityArgs = {
        ...dummyArgs,
        time1: makeTime(LAST_HOUR - 1, 40),
        time2: makeTime(LAST_HOUR - 1, 50),
      };
      const expectedResult: Availability[] = [{
        ...dummyArgs,
        startTimeHours: LAST_HOUR - 1,
        startTimeMinutes: 30,
        endTimeHours: LAST_HOUR,
        endTimeMinutes: 0,
      }];

      // act
      roundUpAvailability(avArgs).map((av) => store.dispatch(addAvailability(av)));
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expectedResult);
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
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expectedResult);
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
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expectedResult);
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
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expectedResult);
    });
  });
});
