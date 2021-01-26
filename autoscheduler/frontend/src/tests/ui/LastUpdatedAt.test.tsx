import { render } from '@testing-library/react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import LastUpdatedAt, { getLastUpdatedAtText } from '../../components/LastUpdatedAt';
import setTerm from '../../redux/actions/term';
import autoSchedulerReducer from '../../redux/reducer';

describe('LastUpdatedAt', () => {
  test('shows the last updated at text', async () => {
    // arrange
    const now = new Date();
    const past = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 0);

    const store = createStore(autoSchedulerReducer);
    store.dispatch(setTerm('202031'));

    fetchMock.mockResponseOnce(JSON.stringify(past));

    // act
    const { findByText } = render(
      <Provider store={store}>
        <LastUpdatedAt />
      </Provider>,
    );

    // There's a race condition in here due to using "now" for the dates, but since we only really
    // care that the text is showing, not that it's right, it's fine
    const text = await findByText(/Last updated/);
    await new Promise(setImmediate);

    // assert
    expect(text).toBeInTheDocument();
  });
});

describe('getLastUpdatedAtText', () => {
  describe('uses seconds and formats it correctly', () => {
    test('when last updated was less than a minute ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 1, 0, 0, 30);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('less than a minute ago');
    });
  });

  describe('uses minutes and formats it correctly', () => {
    test('when last updated was less than an hour ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 1, 0, 30, 0);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('30 minutes ago');
    });

    test('and uses singular when last updated was 1 minute ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 1, 0, 1, 0);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('1 minute ago');
    });
  });

  describe('uses hours and formats it correctly', () => {
    test('when last updated was less than a day ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 1, 3, 0, 0);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('3 hours ago');
    });

    test('and uses singular when last updated was 1 hour ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 1, 1, 0, 0);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('1 hour ago');
    });
  });

  describe('uses days and formats it correctly', () => {
    test('when last updated was less than a week ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 3, 0, 0, 0);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('2 days ago');
    });

    test('and uses singular when last updated was 1 day ago', () => {
      // arrange
      const previous = new Date(2020, 1, 1, 0, 0, 0);
      const now = new Date(2020, 1, 2, 0, 0, 0);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('1 day ago');
    });
  });

  describe('uses the date and formats it correctly', () => {
    test('when last updated was a week or more ago', () => {
      // arrange
      const previous = new Date(2020, 0, 1);
      const now = new Date(2020, 0, 8);

      // act
      const result = getLastUpdatedAtText(previous, now);

      // assert
      expect(result).toEqual('on 1/1/20');
    });
  });
});
