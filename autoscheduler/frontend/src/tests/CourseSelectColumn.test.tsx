import * as React from 'react';

import {
  render, fireEvent, act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../redux/reducer';
import CourseSelectColumn from '../components/CourseSelectColumn/CourseSelectColumn';

describe('CourseSelectColumn', () => {
  describe('Adds a course card', () => {
    test('wehn the Add Course button is clicked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getByText, getAllByText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      // Press the button
      act(() => { fireEvent.click(getByText('Add Course')); });

      // Get the course cards
      const cardsCount = getAllByText('Remove').length;

      // assert
      // There should be now be two since it defaults to one at the beginning
      expect(cardsCount).toEqual(2);
    });
  });

  describe('Removes a course card', () => {
    test('when Remove is clicked on a course card', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getByText, queryAllByText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      // Press the button
      act(() => { fireEvent.click(getByText('Remove')); });

      const cardsCount = queryAllByText('Remove').length;

      // assert
      // Starts with 1 by default, so removing one should make it 0
      expect(cardsCount).toEqual(0);
    });
  });

  describe('Web Only box is checked', () => {
    test('when it is clicked on the second course card', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText, getByText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Add Course'));
      fireEvent.click(getAllByText('Web Only')[1]);
      const checked = document.getElementsByClassName('Mui-checked').length;

      // assert
      expect(checked).toEqual(1);
    });
  });
});
