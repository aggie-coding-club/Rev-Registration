import { createStore } from 'redux';
import autoSchedulerReducer from '../../redux/reducer';
import { addSchedule, replaceSchedules, removeSchedule } from '../../redux/actions/schedules';
import { testSchedule1, testSchedule2 } from '../testSchedules';

describe('Scheduling Page Redux', () => {
  describe('adds new schedules to an empty store', () => {
    test('via addSchedule', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(testSchedule1));
      store.dispatch(addSchedule(testSchedule2));

      // assert
      expect(store.getState().schedules.schedules).toEqual([testSchedule1, testSchedule2]);
    });

    test('via replaceSchedules', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // assert
      expect(store.getState().schedules.schedules).toEqual([testSchedule1, testSchedule2]);
    });
  });
  describe('replaces an existing schedule', () => {
    test('via replaceSchedules', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(testSchedule1));
      store.dispatch(replaceSchedules([testSchedule2]));

      // assert
      expect(store.getState().schedules.schedules).toEqual([testSchedule2]);
    });
    test('via removeSchedule followed by addSchedule', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(testSchedule1));
      store.dispatch(removeSchedule(0));
      store.dispatch(addSchedule(testSchedule2));

      // assert
      expect(store.getState().schedules.schedules).toEqual([testSchedule2]);
    });
  });
  describe('removes a schedule', () => {
    test('if there are initally two schedules and the 0th is removed', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(testSchedule1));
      store.dispatch(addSchedule(testSchedule2));
      store.dispatch(removeSchedule(0));

      // assert
      expect(store.getState().schedules.schedules).toEqual([testSchedule2]);
    });
  });
});
