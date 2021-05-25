import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */ // needed to mock server responses
import * as React from 'react';
import {
  render, fireEvent, waitFor, within,
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
import { InstructionalMethod } from '../../types/Section';
import CourseSelectColumn from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectColumn';
import { getCourseCardHeaderColor } from '../../theme';

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
      fetchMock.mockResponseOnce(JSON.stringify({})); // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      // Disable the course cards so it doesn't count for 'Mui-checked'
      store.dispatch<any>(updateCourseCard(0, { disabled: true }, '201931'));
      const {
        getByText, getByLabelText, findByText,
      } = render(
        <Provider store={store}><CourseSelectColumn /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await findByText('CSCE 121');
      fireEvent.click(csce121Btn);

      // switch to section view
      // select one of the checkboxes
      const sectionView = await waitFor(() => getByText(
        (content, element) => ignoreInvisible(content, element, '501'),
      ));
      fireEvent.click(sectionView);
      // count how many boxes are checked
      const checked1 = document.getElementsByClassName('Mui-checked').length;

      // collapse and re-open card
      fireEvent.click(getByLabelText('Collapse'));
      fireEvent.click(getByLabelText('Expand'));

      // wait until the card is showing section options, then count checked
      await waitFor(() => getByText(
        (content, element) => ignoreInvisible(content, element, '501'),
      ));
      const checked2 = document.getElementsByClassName('Mui-checked').length;

      // assert
      // checks that document queries are working
      expect(checked1).not.toBeFalsy();
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
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course');
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await waitFor(() => getByText('CSCE 121'));
      fireEvent.click(csce121Btn);

      // switch to section view
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

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      const { getByText, getByLabelText, findByRole } = render(
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await waitFor(() => getByText('CSCE 121'));
      fireEvent.click(csce121Btn);

      // switch to section view

      // change course to start loading animation
      fireEvent.change(courseEntry, { target: { value: 'MATH 15' } });
      const math151Btn = await waitFor(() => getByText('MATH 151'));
      fireEvent.click(math151Btn);
      const loadingSpinner = await findByRole('progressbar');

      // assert
      // fetch never returned, so loading spinner should still be in the document
      expect(loadingSpinner).toBeInTheDocument();
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

          if (route.match(/.*sessions\/get_saved_courses.*/)) {
            return Promise.resolve(
              new Response(JSON.stringify({})),
            );
          }

          return Promise.resolve(new Response('404 Not Found'));
        });

        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const {
          getByText, getByLabelText, findByText,
        } = render(
          <Provider store={store}><CourseSelectColumn /></Provider>,
        );

        // fill in course so we can show the sections
        const courseEntry = getByLabelText('Course') as HTMLInputElement;
        fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
        const csce121Btn = await findByText('CSCE 121');
        fireEvent.click(csce121Btn);

        // act
        // switch to sections view

        // collapse then expand the card
        fireEvent.click(getByLabelText('Collapse'));
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
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
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
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
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
    describe('when the customization level is Select', () => {
      test('and no course is selected', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        const { getByText } = render(
          <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
        );
        // Stop course card from loading
        store.dispatch<any>(updateCourseCard(0, { loading: false }));

        // assert
        expect(getByText('Select a course to show available options')).toBeInTheDocument();
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
          <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
        );

        // act
        // fill in course
        const courseEntry = getByLabelText('Course') as HTMLInputElement;
        fireEvent.click(courseEntry);
        fireEvent.change(courseEntry, { target: { value: 'B' } });
        fireEvent.click(await findByText('BIOL 100'));
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
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'M' } });
      fireEvent.click(await findByText('MATH 151'));

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
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'M' } });
      fireEvent.click(await findByText('ENGR 301'));

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
        <Provider store={store}><CourseSelectCard collapsed={false} id={0} /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'C' } });
      fireEvent.click(await findByText('CSCE 121'));
      await waitFor(() => {});

      // assert
      const placeholder = 'There are no available sections for this term';
      expect(queryByText(placeholder)).not.toBeInTheDocument();
    });
  });

  describe('has a header in the collapsed card with', () => {
    test('No Course Selected when the user has not entered a course', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      const { getByText } = render(
        <Provider store={store}><CourseSelectCard collapsed id={0} /></Provider>,
      );

      // assert
      // fetch never returned, so loading spinner should still be in the document
      expect(getByText('No Course Selected')).toBeInTheDocument();
    });

    test('the course title when the user has entered a course', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({})); // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch);

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));

      const { getByText, getByLabelText } = render(
        <Provider store={store}><CourseSelectColumn /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await waitFor(() => getByText('CSCE 121'));
      fireEvent.click(csce121Btn);
      fireEvent.click(getByLabelText('Collapse'));
      await new Promise(setImmediate);

      // assert
      expect(getByText('CSCE 121')).toBeInTheDocument();
    });
  });

  describe('default BasicOptions', () => {
    test('is set to No Preference for Honors', async () => {
      // Arrange
      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['MATH 151'], // MATH has an honors section in testFetch
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031'));

      const { getByLabelText, findByLabelText, findByText } = render(
        <Provider store={store}>
          <CourseSelectCard collapsed={false} id={0} />
        </Provider>,
      );

      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'M' } });
      fireEvent.click(await findByText('MATH 151'));

      expect(await findByLabelText('Honors:')).toHaveTextContent('No Preference');
    });

    test('is set to No Preference for No Meeting Times', async () => {
      // Arrange
      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['ENGR 102'], // ENGR has an async section in testFetch
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031'));

      const { getByLabelText, findByLabelText, findByText } = render(
        <Provider store={store}>
          <CourseSelectCard collapsed={false} id={0} />
        </Provider>,
      );

      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'E' } });
      fireEvent.click(await findByText('ENGR 102'));

      expect(await findByLabelText('No Meeting Times:')).toHaveTextContent('No Preference');
    });

    test('is set to No Preference for Remote', async () => {
      // Arrange
      // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['PSYC 107'], // PSYC has a remote section in testFetch
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('202031'));

      const { getByLabelText, findByLabelText, findByText } = render(
        <Provider store={store}>
          <CourseSelectCard collapsed={false} id={0} />
        </Provider>,
      );

      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.click(courseEntry);
      fireEvent.change(courseEntry, { target: { value: 'P' } });
      fireEvent.click(await findByText('PSYC 107'));

      expect(await findByLabelText('Remote:')).toHaveTextContent('No Preference');
    });
  });

  describe('shows the appropriate instructional method for sections', () => {
    test('when the instructional method is face to face', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({})); // sessions/get_saved_courses
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const { getByText, getByLabelText, findByText } = render(
        <Provider store={store}><CourseSelectColumn /></Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await findByText('CSCE 121');
      fireEvent.click(csce121Btn);

      // wait until the card is showing section options
      const sectionLabel = await waitFor(() => getByText(
        (content, element) => ignoreInvisible(content, element, '501'),
      ));

      // query for instructional method tooltip
      const tooltip = within(sectionLabel).getByTitle(InstructionalMethod.F2F);

      // assert
      expect(tooltip).toBeInTheDocument();
    });
  });

  describe('disabled course cards', () => {
    describe('changes the card header color', () => {
      test('when the card is disabled', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        const { getByLabelText, getByTestId } = render(
          <Provider store={store}>
            <CourseSelectCard collapsed={false} id={0} />
          </Provider>,
        );

        const header = getByTestId('card-header');
        const headerColor = getCourseCardHeaderColor(false); // Should be "#500"
        // pre-assertion to make sure it's not disabled yet
        expect(header).toHaveStyle(`background-color: ${headerColor}`);

        // act
        const disable = getByLabelText('Disable');
        fireEvent.click(disable);

        // assert
        // Don't care what color it changed to - just that it changed from the default
        expect(header).not.toHaveStyle(`background-color: ${headerColor}`);
      });
    });
  });
});
