import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { navigate } from '@reach/router';
import SelectTerm from '../../components/LandingPage/SelectTerm/SelectTerm';
import autoSchedulerReducer from '../../redux/reducer';

// Mocks navigate, so we can assert that it redirected to the correct url for Redirects to /schedule
// This must be outside of all describes in order to function correctly
jest.mock('@reach/router', () => ({
  navigate: jest.fn(),
}));

describe('SelectTerm', () => {
  describe('Menu opens', () => {
    test('Menu opens after button is clicked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      const { getByText } = render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );

      // act
      const button = getByText('Select Term');
      fireEvent.click(button);

      // assert
      expect(document.getElementsByClassName('MuiPopover-root')[0]).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Menu is closed', () => {
    test('on initialization', () => {
      // arrange/act
      const store = createStore(autoSchedulerReducer);

      render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );

      // assert
      expect(document.getElementsByClassName('MuiPopover-root')[0]).toHaveAttribute('aria-hidden');
    });
  });

  describe('Redirects to /schedule', () => {
    test('When term is selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      const { getByText } = render(
        <Provider store={store}>
          <SelectTerm />
        </Provider>,
      );


      // act
      const button = getByText('Select Term');
      fireEvent.click(button);
      const testSemester = getByText('Fall 2020');
      fireEvent.click(testSemester);

      // assert
      // see jest.mock at top of the file
      expect(navigate).toHaveBeenCalledWith('/schedule');
    });
  });
});
