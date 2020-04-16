import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import SchedulePreview from '../components/SchedulingPage/SchedulePreview/SchedulePreview';
import autoSchedulerReducer from '../redux/reducer';
import { replaceSchedules } from '../redux/actions/schedules';
import { testSchedule1, testSchedule2 } from './testSchedules';

describe('SchedulePreview component', () => {
  describe('updates the selected schedule', () => {
    test('when the user clicks on the second schedule', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      fireEvent.click(getByText('Schedule 2'));

      // assert
      expect(store.getState().selectedSchedule).toBe(1);
    });
  });
});
