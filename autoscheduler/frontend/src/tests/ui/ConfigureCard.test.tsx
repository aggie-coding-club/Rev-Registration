import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ConfigureCard from '../../components/SchedulingPage/ConfigureCard/ConfigureCard';
import fetch from '../../components/SchedulingPage/ConfigureCard/generateSchedulesMock';
import autoSchedulerReducer from '../../redux/reducer';

jest.mock('../../components/SchedulingPage/ConfigureCard/generateSchedulesMock', () => ({
  __esModule: true,
  default: jest.fn(() => new Promise(() => {})),
}));

describe('ConfigureCard component', () => {
  describe('makes an API call', () => {
    test('when the user clicks Fetch Schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Generate Schedules'));

      // assert
      expect(fetch).toBeCalledTimes(1);
    });
  });

  describe('shows a loading spinner', () => {
    test('when the user clicks Fetch Schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText, findByRole } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Generate Schedules'));
      const loadingSpinner = await findByRole('progressbar');

      // assert
      expect(loadingSpinner).toBeInTheDocument();
    });
  });
});
