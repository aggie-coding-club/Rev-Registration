import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import CourseSelectColumn from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectColumn';
import testFetch from '../testData';
import setTerm from '../../redux/actions/term';

beforeAll(() => fetchMock.enableMocks());

function ignoreInvisible(content: string, element: HTMLElement, query: string | RegExp): boolean {
  if (element.style.visibility === 'hidden') return false;
  return content.match(query) && content.match(query).length > 0;
}

describe('CourseSelectColumn', () => {
  describe('Adds a course card', () => {
    test('when the Add Course button is clicked', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const { getByText, getAllByText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );
      await new Promise(setImmediate);

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
    test('when Remove is clicked on a course card', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const { getByText, queryAllByText } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );
      await new Promise(setImmediate);

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
      store.dispatch(setTerm('201931'));

      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const {
        getAllByText, getAllByLabelText, findByText,
      } = render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      fetchMock.mockResponseOnce(JSON.stringify({
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch);

      // act
      fireEvent.click(await findByText('Add Course'));

      // fill in course
      const courseEntry = getAllByLabelText('Course')[1] as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'C' } });
      fireEvent.click(await findByText('CSCE 121'));

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

  describe('fetches saved schedules', () => {
    test('when the term is changed', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // sessions/get_saved_courses
      const firstSavedCourses = fetchMock.mockResponseOnce(JSON.stringify({}));

      render(
        <Provider store={store}>
          <CourseSelectColumn />
        </Provider>,
      );

      // act/assert
      // should be called once when term is initially set, and again when changed
      store.dispatch(setTerm('201931'));
      expect(firstSavedCourses).toHaveBeenCalled();

      const secondSavedCourses = fetchMock.mockResponseOnce(JSON.stringify({}));
      store.dispatch(setTerm('202031'));
      expect(secondSavedCourses).toHaveBeenCalled();
    });
  });
});
