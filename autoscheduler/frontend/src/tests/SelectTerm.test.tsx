import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import SelectTerm from '../components/LandingPage/SelectTerm/SelectTerm';
import autoSchedulerReducer from '../redux/reducer';

test('Menu is closed initially', () => {
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

test('Menu closes after item is selected', () => {
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
  const testSemester = getByText('Semester 1');
  fireEvent.click(testSemester);

  // assert
  expect(document.getElementsByClassName('MuiPopover-root')[0]).toHaveAttribute('aria-hidden');
});
