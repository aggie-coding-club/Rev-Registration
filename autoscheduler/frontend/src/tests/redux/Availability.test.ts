import { createStore } from 'redux';
import autoSchedulerReducer from '../../redux/reducer';
import {
  addAvailability,
  deleteAvailability,
  updateAvailability,
  mergeAvailability,
  setAvailabilities,
} from '../../redux/actions/availability';
import 'isomorphic-fetch';
import Availability, { AvailabilityType, argsToAvailability, AvailabilityArgs } from '../../types/Availability';
import DayOfWeek from '../../types/DayOfWeek';
import setTerm from '../../redux/actions/term';

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
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expected);
    });

    test('if the new one starts when the old one ends', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const availability1 = {
        ...dummyArgs,
        time1: makeTime(8, 0),
        time2: makeTime(12, 0),
      };
      const availability2 = {
        ...dummyArgs,
        time1: makeTime(12, 0),
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
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expected);
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
      store.dispatch(mergeAvailability());

      // assert
      expect(store.getState().termData.availability).toEqual(expected);
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
      expect(store.getState().termData.availability).toEqual(expected);
    });

    test('when dragging an old availability', () => {
      // arrrange
      const preloadedState = {
        termData: {
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
        },
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
      expect(store.getState().termData.availability).toHaveLength(2);
      expect(store.getState().termData.availability).toContainEqual(expectedAv1);
      expect(store.getState().termData.availability).toContainEqual(expectedAv2);
    });

    test('if multiple availabilities are created at once with a single overlap', () => {
      // arrange - setup one pre-existing availability
      const store = createStore(autoSchedulerReducer);
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.TUE,
        available: AvailabilityType.BUSY,
        time1: 13 * 60 + 0,
        time2: 15 * 60 + 0,
      }));
      const newAvArgs = {
        available: AvailabilityType.BUSY,
        time1: 14 * 60 + 0,
        time2: 16 * 60 + 0,
      };
      const unmergedAvailability = {
        available: AvailabilityType.BUSY,
        startTimeHours: 14,
        startTimeMinutes: 0,
        endTimeHours: 16,
        endTimeMinutes: 0,
      };
      const mergedAvailability = {
        available: AvailabilityType.BUSY,
        startTimeHours: 13,
        startTimeMinutes: 0,
        endTimeHours: 16,
        endTimeMinutes: 0,
      };

      // act - add 3 availabilities at once
      store.dispatch(addAvailability({
        ...newAvArgs,
        dayOfWeek: DayOfWeek.MON,
      }));
      store.dispatch(addAvailability({
        ...newAvArgs,
        dayOfWeek: DayOfWeek.TUE,
      }));
      store.dispatch(addAvailability({
        ...newAvArgs,
        dayOfWeek: DayOfWeek.WED,
      }));
      store.dispatch(mergeAvailability(3));

      // assert - the Tuesday av is merged but monday is not
      const finalAvailabilties = store.getState().termData.availability;
      expect(finalAvailabilties).toContainEqual<Availability>({
        dayOfWeek: DayOfWeek.MON,
        ...unmergedAvailability,
      });
      expect(finalAvailabilties).toContainEqual<Availability>({
        dayOfWeek: DayOfWeek.TUE,
        ...mergedAvailability,
      });
    });

    test('if multiple new availabilities overlap with multiple old availabilities', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      // add a pre-existing availability from 13:00 - 15:00 on Mon thru Thurs
      const oldAvArgs = {
        available: AvailabilityType.BUSY,
        time1: makeTime(13, 0),
        time2: makeTime(15, 0),
      };
      const newAvArgs = {
        available: AvailabilityType.BUSY,
        time1: makeTime(16, 0),
        time2: makeTime(14, 0),
      };
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.MON,
        ...oldAvArgs,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.TUE,
        ...oldAvArgs,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.WED,
        ...oldAvArgs,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.THU,
        ...oldAvArgs,
      }));
      // Mon and Thu should be unmerged 13 - 15, Tue and Wed should be merged, 13 - 16
      const unmerged = {
        available: AvailabilityType.BUSY,
        startTimeHours: 13,
        startTimeMinutes: 0,
        endTimeHours: 15,
        endTimeMinutes: 0,
      };
      const merged = {
        available: AvailabilityType.BUSY,
        startTimeHours: 13,
        startTimeMinutes: 0,
        endTimeHours: 16,
        endTimeMinutes: 0,
      };
      // helpers to make assertion easy to read
      const availabilityOn = (day: DayOfWeek):
        Availability => store.getState().termData.availability.find((av) => av.dayOfWeek === day);

      // act
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.WED,
        ...newAvArgs,
      }));
      store.dispatch(addAvailability({
        dayOfWeek: DayOfWeek.TUE,
        ...newAvArgs,
      }));
      store.dispatch(mergeAvailability(2));

      // assert
      expect(availabilityOn(DayOfWeek.MON)).toEqual({
        dayOfWeek: DayOfWeek.MON,
        ...unmerged,
      });
      expect(availabilityOn(DayOfWeek.TUE)).toEqual({
        dayOfWeek: DayOfWeek.TUE,
        ...merged,
      });
      expect(availabilityOn(DayOfWeek.WED)).toEqual({
        dayOfWeek: DayOfWeek.WED,
        ...merged,
      });
      expect(availabilityOn(DayOfWeek.THU)).toEqual({
        dayOfWeek: DayOfWeek.THU,
        ...unmerged,
      });
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
      expect(store.getState().termData.availability).toEqual(expected);
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
      expect(store.getState().termData.availability).toHaveLength(0);
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
      expect(store.getState().termData.availability).toEqual(expected);
    });
  });

  describe('are cleared and updated with new ones', () => {
    test('when setAvailabilities is called', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031'));
      const expected: Availability[] = [{
        ...dummyArgs,
        startTimeHours: 10,
        startTimeMinutes: 0,
        endTimeHours: 11,
        endTimeMinutes: 0,
      }];

      // act
      store.dispatch(setAvailabilities(expected, '202031'));

      // assert
      expect(store.getState().termData.availability).toEqual(expected);
    });
  });

  describe('skips set availabilities', () => {
    test("when there's a term mismatch", () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031'));

      const mismatchedAvails: Availability[] = [{
        ...dummyArgs,
        startTimeHours: 10,
        startTimeMinutes: 0,
        endTimeHours: 11,
        endTimeMinutes: 0,
      }];

      // act
      store.dispatch(setAvailabilities(mismatchedAvails, '201931')); // mismatched term

      // assert
      expect(store.getState().termData.availability.length).toEqual(0);
    });
  });
});
