import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, fireEvent, waitForDomChange, queryByText as queryContainerByText,
} from '@testing-library/react';
import autoSchedulerReducer from '../../redux/reducer';
import SchedulingPage from '../../components/SchedulingPage/SchedulingPage';

describe('Scheduling Page UI', () => {
  describe('shows an error message', () => {
    test('when there are no schedules to show', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findByText } = render(
        <Provider store={store}>
          <SchedulingPage />
        </Provider>,
      );

      // nothing to act on

      // assert
      expect(await findByText('No schedules available.')).toBeTruthy();
    });
  });
  describe('adds schedules to the Schedule Preview', () => {
    test('when the user clicks Generate Schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText, queryByText } = render(
        <Provider store={store}>
          <SchedulingPage />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Generate Schedules'));
      await waitForDomChange();

      // assert
      expect(queryByText('No schedules available')).toBeFalsy();
      expect(queryByText('Schedule 1')).toBeTruthy();
    });
  });
  describe('changes the meetings shown in the Schedule', () => {
    test('when the user clicks on a different schedule in the Schedule Preview', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const {
        getByLabelText, getByRole, findByText, findAllByText,
      } = render(
        <Provider store={store}>
          <SchedulingPage />
        </Provider>,
      );

      // act
      fireEvent.click(getByRole('button', { name: 'Generate Schedules' }));
      const schedule2 = await findByText('Schedule 2');
      fireEvent.click(schedule2);
      // DEPT 123 will be added to the schedule no matter which schedule is chosen
      await findAllByText(/DEPT 123.*/);
      const calendarDay = getByLabelText('Tuesday');

      // assert
      // Schedule 1 has BIOL 319 in it
      // Schedule 2 has BIOL 351 instead
      // we check Tuesday to avoid selecting the equivalent text in SchedulePreview
      expect(queryContainerByText(calendarDay, /BIOL 319.*/)).toBeFalsy();
      expect(queryContainerByText(calendarDay, /BIOL 351.*/)).toBeTruthy();
    });
  });
});
