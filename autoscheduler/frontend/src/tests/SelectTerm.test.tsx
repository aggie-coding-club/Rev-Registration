import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import SelectTerm from '../components/LandingPage/SelectTerm/SelectTerm';
import autoSchedulerReducer from '../redux/reducer';

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

      // Mocks window.location.assign(url), so we can assert that it redirected to the correct url
      const assignSpy = jest.spyOn(window.location, 'assign').mockImplementation();

      // act
      const button = getByText('Select Term');
      fireEvent.click(button);
      const testSemester = getByText('Semester 1');
      fireEvent.click(testSemester);

      // assert
      expect(assignSpy).toHaveBeenCalledWith('/schedule');
    });
  });
});
