import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import SchedulePreview from '../../components/SchedulingPage/SchedulePreview/SchedulePreview';
import autoSchedulerReducer from '../../redux/reducer';
import { replaceSchedules } from '../../redux/actions/schedules';
import { testSchedule1, testSchedule2 } from '../testSchedules';

describe('SchedulePreview component', () => {
  describe('updates the selected schedule', () => {
    test('when the user clicks on the second schedule', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const schedules = await findAllByLabelText('Schedule preview');
      fireEvent.click(schedules[1]);

      // assert
      expect(store.getState().selectedSchedule).toBe(1);
    });
  });

  describe('saves the correct schedule', () => {
    test('when the first schedule is saved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[0];
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules[0].saved).toBe(true)
      ));
    });

    test('when a schedule with index greater than 0 is saved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[1];
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules[1].saved).toBe(true)
      ));
    });
  });

  describe('unsaves the correct schedule', () => {
    test('when the first schedule is unsaved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText, findByTitle } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // save, wait for save to finish, then unsave
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[0];
      fireEvent.click(saveScheduleButton);
      await findByTitle('Unsave');
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules.filter((schedule) => schedule.saved)).toHaveLength(0)
      ));
    });

    test('when a schedule with index greater than 0 is unsaved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText, findByTitle } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // save, wait for save to finish, then unsave
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[1];
      fireEvent.click(saveScheduleButton);
      await findByTitle('Unsave');
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules.filter((schedule) => schedule.saved)).toHaveLength(0)
      ));
    });
  });

  describe('deletes the correct schedule', () => {
    test('when an unsaved schedule is deleted', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const deleteScheduleButton = (await findAllByLabelText('Delete schedule'))[1];
      fireEvent.click(deleteScheduleButton);

      // assert
      const { schedules } = store.getState();
      expect(schedules).toHaveLength(1);
      expect(schedules[0].meetings).toEqual(testSchedule1);
    });

    test('when deleted from the dialog from a saved schedule', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText, getByText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[1];
      fireEvent.click(saveScheduleButton);

      const deleteScheduleButton = (await findAllByLabelText('Delete schedule'))[1];
      fireEvent.click(deleteScheduleButton);

      const confirmDeleteButton = getByText('Delete');
      fireEvent.click(confirmDeleteButton);

      // assert
      const { schedules } = store.getState();
      expect(schedules).toHaveLength(1);
      expect(schedules[0].saved).toBe(false);
      expect(schedules[0].meetings).toEqual(testSchedule1);
    });
  });

  describe('renames the correct schedule', () => {
    test('when the first schedule is renamed', async () => {
      // arrange
      const newScheduleName = 'Test schedule';

      const store = createStore(autoSchedulerReducer);
      const { findByLabelText, findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // click button to rename schedule
      const renameScheduleButton = (await findAllByLabelText('Rename schedule'))[0];
      fireEvent.click(renameScheduleButton);

      // set new name
      const scheduleNameInput = (await findByLabelText('Schedule name'));
      if (!(scheduleNameInput instanceof HTMLInputElement)) throw Error('Input element is not valid');
      fireEvent.change(scheduleNameInput, { target: { value: newScheduleName } });

      // confirm new name
      fireEvent.click(renameScheduleButton);

      // assert
      expect(store.getState().schedules[0].name).toBe(newScheduleName);
    });

    test('when the second schedule is renamed', async () => {
      // arrange
      const newScheduleName = 'Cool classes for cool kids';

      const store = createStore(autoSchedulerReducer);
      const { findByLabelText, findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // click button to rename schedule
      const renameScheduleButton = (await findAllByLabelText('Rename schedule'))[1];
      fireEvent.click(renameScheduleButton);

      // set new name
      const scheduleNameInput = (await findByLabelText('Schedule name'));
      if (!(scheduleNameInput instanceof HTMLInputElement)) throw Error('Input element is not valid');
      fireEvent.change(scheduleNameInput, { target: { value: newScheduleName } });

      // confirm new name
      fireEvent.click(renameScheduleButton);

      // assert
      expect(store.getState().schedules[1].name).toBe(newScheduleName);
    });
  });
});
