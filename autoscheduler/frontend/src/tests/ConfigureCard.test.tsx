import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ConfigureCard from '../components/SchedulingPage/ConfigureCard/ConfigureCard';
import fetch from '../components/SchedulingPage/ConfigureCard/generateSchedulesMock';
import autoSchedulerReducer from '../redux/reducer';

jest.mock('../components/SchedulingPage/ConfigureCard/generateSchedulesMock', () => ({
  __esModule: true,
  default: jest.fn(() => new Promise(() => {})),
}));

describe('OptionsCard component', () => {
  describe('makes an API call', () => {
    test('when the user clicks Fetch Schedules', () => {
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
});
