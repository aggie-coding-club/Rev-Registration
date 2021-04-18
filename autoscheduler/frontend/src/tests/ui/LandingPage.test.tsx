import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LandingPage from '../../components/LandingPage/LandingPage';
import autoSchedulerReducer from '../../redux/reducer';

describe('Landing Page', () => {
  test('sets term to null', async () => {
    // Arrange
    fetchMock.mockResponseOnce(JSON.stringify({ 'Fall 2021 - College Station': '202131' }));

    const store = createStore(autoSchedulerReducer, {
      termData: {
        term: '202131',
      },
    });

    // Act
    render(
      <Provider store={store}>
        <LandingPage />
      </Provider>,
    );

    // const all = getAllByText('Fall 2021 - College Station');

    // Assert
    expect(store.getState().termData.term).toBeNull();
  });
});
