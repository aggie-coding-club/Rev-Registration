/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../redux/reducer';
import CourseSelectColumn from '../components/CourseSelectColumn/CourseSelectColumn';
import 'isomorphic-fetch';

function ignoreInvisible(content: string, element: HTMLElement, query: string | RegExp): boolean {
  if (element.style.visibility === 'hidden') return false;
  return content.match(query) && content.match(query).length > 0;
}

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

  describe('Section 501 box is checked', () => {
    test('when it is clicked on the second course card', async () => {
      // arrange
      const nodeProps = Object.create(Node.prototype, {});
      // @ts-ignore
      document.createRange = (): Range => ({
        setStart: (): void => {},
        setEnd: (): void => {},
        commonAncestorContainer: {
          ...nodeProps,
          nodeName: 'BODY',
          ownerDocument: document,
        },
      });
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getAllByText, getByText, getAllByLabelText, findByText,
      } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Add Course'));

      // fill in course
      const courseEntry = getAllByLabelText('Course')[1] as HTMLInputElement;
      act(() => { fireEvent.click(courseEntry); });
      act(() => { fireEvent.click(getByText('CSCE 121')); });

      // switch to section select and select section 501
      fireEvent.click(getAllByText('Section')[1]);
      fireEvent.click(
        await findByText((content, element) => ignoreInvisible(content, element, '501')),
      );
      const checked = document.getElementsByClassName('Mui-checked').length;

      // assert
      expect(checked).toEqual(1);
    });
  });
});
