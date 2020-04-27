import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
/* eslint-disable @typescript-eslint/ban-ts-ignore */
import * as React from 'react';
import {
  render, fireEvent, act, waitForElement,
} from '@testing-library/react';
import 'isomorphic-fetch';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import CourseSelectCard from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/CourseSelectCard';
import autoSchedulerReducer from '../../redux/reducer';
import testFetch from '../testData';
import setTerm from '../../redux/actions/term';

function ignoreInvisible(content: string, element: HTMLElement, query: string | RegExp): boolean {
  if (element.style.visibility === 'hidden') return false;
  return content.match(query) && content.match(query).length > 0;
}

describe('Course Select Card', () => {
  beforeAll(() => {
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
  });

  beforeEach(fetchMock.resetMocks);

  describe('remembers its state', () => {
    test('ater collapse', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const { getByText, getByLabelText } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      act(() => { fireEvent.change(courseEntry, { target: { value: 'CSCE ' } }); });
      const csce121Btn = await waitForElement(() => getByText('CSCE 121'));
      act(() => { fireEvent.click(csce121Btn); });

      // switch to section view
      act(() => { fireEvent.click(getByText('Section')); });
      // select one of the checkboxes
      const sectionView = await waitForElement(() => getByText(
        (content, element) => ignoreInvisible(content, element, '501'),
      ));
      act(() => { fireEvent.click(sectionView); });
      // count how many boxes are checked
      const checked1 = document.getElementsByClassName('Mui-checked').length;

      // collapse and re-open card
      act(() => { fireEvent.click(getByText('Collapse')); });
      act(() => { fireEvent.click(getByLabelText('Expand')); });

      // wait until the card is showing section options, then count checked
      await waitForElement(() => getByText(
        (content, element) => ignoreInvisible(content, element, '501'),
      ));
      const checked2 = document.getElementsByClassName('Mui-checked').length;

      // assert
      // checks that document queries are working
      expect(checked1).toEqual(1);
      // checks that the card remembers how many elements were checked
      expect(checked2).toEqual(checked1);
    });
  });

  describe('changes sections', () => {
    test('when we change the selected course', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch);
      fetchMock.mockResponseOnce(JSON.stringify({
        results: ['MATH 151'],
      }));
      fetchMock.mockImplementationOnce(testFetch);

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, getAllByText,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      act(() => { fireEvent.change(courseEntry, { target: { value: 'CSCE ' } }); });
      const csce121Btn = await waitForElement(() => getByText('CSCE 121'));
      act(() => { fireEvent.click(csce121Btn); });

      // switch to section view
      act(() => { fireEvent.click(getByText('Section')); });
      const course1Sections = (await waitForElement(() => getAllByText(/50\d/))).length;

      // change course and read sections again
      act(() => { fireEvent.change(courseEntry, { target: { value: 'MATH 15' } }); });
      const math151Btn = await waitForElement(() => getByText('MATH 151'));
      act(() => { fireEvent.click(math151Btn); });
      const course2Sections = (await waitForElement(() => getAllByText(/51\d/))).length;

      // assert
      expect(course1Sections).not.toEqual(0);
      expect(course2Sections).not.toEqual(0);
      expect(course1Sections).not.toEqual(course2Sections);
    });
  });

  describe('only fetches api/sections once', () => {
    describe('when we search and go to the Sections tab', () => {
      test('and collapse then expand the card', async () => {
        // arrange
        let sectionsFetchCount = 0; // how many times api/sections has been called

        fetchMock.mockImplementation((route: string): Promise<Response> => {
          if (route.match(/api\/course\/search.+/)) {
            return Promise.resolve(new Response(JSON.stringify({
              results: ['CSCE 121'],
            })));
          }

          if (route.match(/api\/sections.+/)) {
            sectionsFetchCount += 1;
            return testFetch(route);
          }

          return Promise.resolve(new Response('404 Not Found'));
        });

        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const { getByText, getByLabelText } = render(
          <Provider store={store}><CourseSelectCard id={0} /></Provider>,
        );

        // fill in course so we can show the sections
        const courseEntry = getByLabelText('Course') as HTMLInputElement;
        act(() => { fireEvent.change(courseEntry, { target: { value: 'CSCE ' } }); });
        const csce121Btn = await waitForElement(() => getByText('CSCE 121'));
        act(() => { fireEvent.click(csce121Btn); });

        // act
        // switch to sections view
        act(() => { fireEvent.click(getByText('Section')); }); // Makes api/sections be called

        // collapse then expand the card
        act(() => { fireEvent.click(getByText('Collapse')); });
        act(() => { fireEvent.click(getByLabelText('Expand')); });

        // assert
        expect(sectionsFetchCount).toEqual(1);
      });
    });
  });

  describe('does not fetch api/course/search', () => {
    test('when theres an empty input', async () => {
      // arrange
      let courseSearchFetchCount = 0;

      fetchMock.mockImplementation((route: string): Promise<Response> => {
        if (route.match(/api\/course\/search.+/)) {
          courseSearchFetchCount += 1;

          return Promise.resolve(new Response(JSON.stringify({
            results: ['CSCE 121'],
          })));
        }

        return Promise.resolve(new Response('404 Not Found'));
      });

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const { getByLabelText } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // Fill in the search bar initially
      const courseEntry = getByLabelText('Course') as HTMLInputElement;

      // act
      // Enter empty string into search box, akin to it being selected
      act(() => { fireEvent.change(courseEntry, { target: { value: '' } }); });

      // assert
      // Should only have fetched for the initial entering of the search, not the removal
      expect(courseSearchFetchCount).toEqual(0);
    });

    test('when we remove the previous search', async () => {
      // arrange
      let courseSearchFetchCount = 0;

      fetchMock.mockImplementation((route: string): Promise<Response> => {
        if (route.match(/api\/course\/search.+/)) {
          courseSearchFetchCount += 1;

          return Promise.resolve(new Response(JSON.stringify({
            results: ['CSCE 121'],
          })));
        }

        return Promise.resolve(new Response('404 Not Found'));
      });

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const { getByText, getByLabelText } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // Fill in the search bar initially
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      act(() => { fireEvent.change(courseEntry, { target: { value: 'CSCE ' } }); });
      await waitForElement(() => getByText('CSCE 121')); // Wait for the fetch to be processed

      // act
      // remove the search text
      act(() => { fireEvent.change(courseEntry, { target: { value: '' } }); });

      // assert
      // Should only have fetched for the initial entering of the search, not the removal
      expect(courseSearchFetchCount).toEqual(1);
    });
  });
});
