import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { LocationProvider, createHistory, createMemorySource } from '@reach/router';
import App from '../../components/App/App';
import autoSchedulerReducer from '../../redux/reducer';

test('renders without errors', async () => {
  // arrange/act
  // Mock responses for the Navbar component so that App renders correctly
  fetchMock.mockResponseOnce(JSON.stringify({}));
  // Mock response for SelectTerm component so that App renders correctly
  fetchMock.mockResponseOnce(JSON.stringify({}));
  fetchMock.mockResponseOnce(JSON.stringify({})); // Mock api/terms, again

  const store = createStore(autoSchedulerReducer);
  let container;
  await act(async () => { container = render(<Provider store={store}><App /></Provider>); });

  // assert
  expect(container).toBeTruthy();
});

describe('shows an error page', () => {
  test('when the user navigates to an invalid route', async () => {
    // arrange
    fetchMock.mockResponseOnce(JSON.stringify({}));
    fetchMock.mockResponseOnce(JSON.stringify({}));
    fetchMock.mockResponseOnce(JSON.stringify({})); // Mock api/terms, again
    const store = createStore(autoSchedulerReducer);

    // create history
    const source = createMemorySource('/dkjsdjksjdk');
    const history = createHistory(source);
    const { getByText } = render(
      <LocationProvider history={history}>
        <Provider store={store}>
          <App />
        </Provider>
      </LocationProvider>,
    );

    const element = await waitFor(() => getByText('Page Not Found'));

    // assert
    expect(element).toBeInTheDocument();
  });
});
