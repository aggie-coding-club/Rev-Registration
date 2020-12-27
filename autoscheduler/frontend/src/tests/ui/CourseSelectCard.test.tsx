import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */ // needed to mock server responses
import * as React from 'react';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import 'isomorphic-fetch';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import CourseSelectCard from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/CourseSelectCard';
import autoSchedulerReducer from '../../redux/reducer';
import testFetch from '../testData';
import setTerm from '../../redux/actions/term';
import { updateCourseCard } from '../../redux/actions/courseCards';

function ignoreInvisible(content: string, element: HTMLElement, query: string | RegExp): boolean {
  if (element.style.visibility === 'hidden') return false;
  return content.match(query) && content.match(query).length > 0;
}

describe('Course Select Card UI', () => {
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
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  describe('remembers its state', () => {
    test('ater collapsing and expanding', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const { getByText, getByLabelText, findByText } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await findByText('CSCE 121');
      fireEvent.click(csce121Btn);

      // switch to section view
      fireEvent.click(getByText('Section'));
      // select one of the checkboxes
      const sectionView = await waitFor(() => getByText(
        (content, element) => ignoreInvisible(content, element, '501'),
      ));
      fireEvent.click(sectionView);
      // count how many boxes are checked
      const checked1 = document.getElementsByClassName('Mui-checked').length;

      // collapse and re-open card
      fireEvent.click(getByText('Collapse'));
      fireEvent.click(getByLabelText('Expand'));

      // wait until the card is showing section options, then count checked
      await waitFor(() => getByText(
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

  describe('changes the displayed sections', () => {
    test('when the selected course is changed', async () => {
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

      const { getByText, getByLabelText, findAllByText } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await waitFor(() => getByText('CSCE 121'));
      fireEvent.click(csce121Btn);

      // switch to section view
      fireEvent.click(getByText('Section'));
      const course1Sections = (await findAllByText(/50\d/)).length;

      // change course and read sections again
      fireEvent.change(courseEntry, { target: { value: 'MATH 15' } });
      const math151Btn = await waitFor(() => getByText('MATH 151'));
      fireEvent.click(math151Btn);
      const course2Sections = (await findAllByText(/20\d/)).length;

      // assert
      expect(course1Sections).not.toEqual(0);
      expect(course2Sections).not.toEqual(0);
      expect(course1Sections).not.toEqual(course2Sections);
    });
  });

  describe('shows a loading spinner', () => {
    test('when the selected course is changed', async () => {
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

      const { getByText, getByLabelText, findByRole } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await waitFor(() => getByText('CSCE 121'));
      fireEvent.click(csce121Btn);

      // switch to section view
      fireEvent.click(getByText('Section'));

      // change course to start loading animation
      fireEvent.change(courseEntry, { target: { value: 'MATH 15' } });
      const math151Btn = await waitFor(() => getByText('MATH 151'));
      fireEvent.click(math151Btn);
      const loadingSpinner = await findByRole('progressbar');

      // assert
      // the loading spinner was shown at one point, but is now hidden
      expect(loadingSpinner).toBeTruthy();
      expect(loadingSpinner).not.toBeInTheDocument();
    });
  });

  describe('does not fetch inappropriately', () => {
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
        const { getByText, getByLabelText, findByText } = render(
          <Provider store={store}><CourseSelectCard id={0} /></Provider>,
        );

        // fill in course so we can show the sections
        const courseEntry = getByLabelText('Course') as HTMLInputElement;
        fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
        const csce121Btn = await findByText('CSCE 121');
        fireEvent.click(csce121Btn);

        // act
        // switch to sections view
        fireEvent.click(getByText('Section')); // Makes api/sections be called

        // collapse then expand the card
        fireEvent.click(getByText('Collapse'));
        fireEvent.click(getByLabelText('Expand'));

        // assert
        expect(sectionsFetchCount).toEqual(1);
      });
    });

    test('when there is an empty input', async () => {
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
      fireEvent.change(courseEntry, { target: { value: '' } });

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
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      await waitFor(() => getByText('CSCE 121')); // Wait for the fetch to be processed

      // act
      // remove the search text
      fireEvent.change(courseEntry, { target: { value: '' } });

      // assert
      // Should only have fetched for the initial entering of the search, not the removal
      expect(courseSearchFetchCount).toEqual(1);
    });
  });

  describe('shows appropriate placeholder text', () => {
    describe('when the customization level is Basic', () => {
      test('and no course is selected', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const { getByText } = render(
          <Provider store={store}><CourseSelectCard id={0} /></Provider>,
        );
        // Stop course card from loading
        store.dispatch<any>(updateCourseCard(0, { loading: false }));

        // assert
        expect(getByText('Select a course to show available options')).toBeInTheDocument();
      });

      test('and there are no honors or online sections', async () => {
        // arrange
        fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
          results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
        }));
        fetchMock.mockImplementationOnce(testFetch); // api/sections

        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const { getByLabelText, findByText } = render(
          <Provider store={store}><CourseSelectCard id={0} /></Provider>,
        );

        // act
        // fill in course
        const courseEntry = getByLabelText('Course') as HTMLInputElement;
        fireEvent.click(courseEntry);
        fireEvent.change(courseEntry, { target: { value: 'C' } });
        fireEvent.click(await findByText('CSCE 121'));
        const placeholder = await findByText('There are no honors or remote sections for this class');

        // assert
        expect(placeholder).toBeInTheDocument();
      });
    });

    describe('when the customization level is Section', () => {
      test('and no course is selected', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const { getByText, findByText } = render(
          <Provider store={store}><CourseSelectCard id={0} /></Provider>,
        );

        // act
        fireEvent.click(getByText('Section'));
        const placeholder = await findByText('Select a course to show available sections');

        // assert
        expect(placeholder).toBeInTheDocument();
      });

      test('and there are no sections at all', async () => {
        // arrange
        fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
          results: ['CSCE 121', 'CSCE 221', 'CSCE 312', 'BIOL 100'],
        }));
        fetchMock.mockImplementationOnce(testFetch); // api/sections

        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const { getByText, getByLabelText, findByText } = render(
          <Provider store={store}><CourseSelectCard id={0} /></Provider>,
        );

        // act
        // fill in course
        const courseEntry = getByLabelText('Course') as HTMLInputElement;
        fireEvent.click(courseEntry);
        fireEvent.change(courseEntry, { target: { value: 'B' } });
        fireEvent.click(await findByText('BIOL 100'));
        fireEvent.click(getByText('Section'));
        const placeholder = await findByText('There are no available sections for this term');

        // assert
        expect(placeholder).toBeInTheDocument();
      });
    });
  });

  describe('hides the placeholder text', () => {
    test('when the customization filter is Basic and there are honors sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312', 'MATH 151'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, queryByText, findByText,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'M' } });
      fireEvent.click(await findByText('MATH 151'));

      fireEvent.click(getByText('Section'));
      await waitFor(() => {});

      // assert
      const placeholder = 'There are no honors or online sections for this class';
      expect(queryByText(placeholder)).not.toBeInTheDocument();
    });

    test('when the customization filter is Basic and there are asynchronous sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312', 'ENGR 301'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, queryByText, findByText,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'M' } });
      fireEvent.click(await findByText('ENGR 301'));

      fireEvent.click(getByText('Section'));
      await waitFor(() => {});

      // assert
      const placeholder = 'There are no honors or online courses for this class';
      expect(queryByText(placeholder)).not.toBeInTheDocument();
    });

    test('when the customization filter is Section and there are sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, queryByText, findByText,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'C' } });
      fireEvent.click(await findByText('CSCE 121'));
      fireEvent.click(getByText('Section'));
      await waitFor(() => {});

      // assert
      const placeholder = 'There are no available sections for this term';
      expect(queryByText(placeholder)).not.toBeInTheDocument();
    });
  });
});
