import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();
/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { act, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from '../../components/App/App';
import autoSchedulerReducer from '../../redux/reducer';

test('renders without errors', async () => {
  // arrange/act
  // Mock responses for the Navbar component so that App renders correctly
  fetchMock.mockResponseOnce(JSON.stringify({})); // get is logged in api
  fetchMock.mockResponseOnce(JSON.stringify({})); // get name api
  // Mock response for SelectTerm component so that App renders correctly
  fetchMock.mockResponseOnce(JSON.stringify({}));

  const store = createStore(autoSchedulerReducer);
  let container;
  await act(async () => { container = render(<Provider store={store}><App /></Provider>); });

  // assert
  expect(container).toBeTruthy();
});
