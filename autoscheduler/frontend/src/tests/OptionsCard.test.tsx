import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import OptionsCard from '../components/SchedulingPage/OptionsCard/OptionsCard';
import fetch from '../components/SchedulingPage/OptionsCard/generateSchedulesMock';
import autoSchedulerReducer from '../redux/reducer';

jest.mock('../components/SchedulingPage/OptionsCard/generateSchedulesMock', () => ({
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
          <OptionsCard />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Fetch Schedules'));

      // assert
      expect(fetch).toBeCalledTimes(1);
    });
  });
});
