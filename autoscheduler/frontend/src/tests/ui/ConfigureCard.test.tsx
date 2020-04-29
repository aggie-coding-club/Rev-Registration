import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ConfigureCard from '../../components/SchedulingPage/ConfigureCard/ConfigureCard';
import autoSchedulerReducer from '../../redux/reducer';

jest.mock('../../components/SchedulingPage/ConfigureCard/generateSchedulesMock', () => ({
  __esModule: true,
  default: jest.fn(() => new Promise(() => {})),
}));

describe('ConfigureCard component', () => {
  describe('makes an API call', () => {
    test('when the user clicks Fetch Schedules', () => {
      let fetchCount = 0;

      fetchMock.mockImplementation((route: string): Promise<Response> => {
        if (route.match(/scheduler\/generate/)) {
          fetchCount += 1;

          // Don't need to return anything valid for this test
          return Promise.resolve(new Response(JSON.stringify([])));
        }

        return Promise.resolve(new Response('404 Not Found'));
      });

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
      expect(fetchCount).toEqual(1);
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
