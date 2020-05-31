import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable @typescript-eslint/camelcase */ // needed to mock server responses
import * as React from 'react';
import {
  render, fireEvent, waitFor, queryByTitle as queryByTitleIn,
} from '@testing-library/react';
import 'isomorphic-fetch';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import CourseSelectCard from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/CourseSelectCard';
import autoSchedulerReducer from '../../redux/reducer';
import testFetch from '../testData';
import setTerm from '../../redux/actions/term';
import SectionSelect from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionSelect';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import { updateCourseCard } from '../../redux/actions/courseCards';

const dummySectionArgs = {
  id: 123456,
  crn: 123456,
  section_num: '501',
  min_credits: 0,
  max_credits: 0,
  current_enrollment: 0,
  max_enrollment: 0,
  honors: false,
  web: false,
  instructor_name: 'Aakash Tyagi',
  meetings: [{
    id: 11,
    days: [true, false, false, false, false, false, false],
    start_time: '08:00',
    end_time: '08:50',
    type: 'LEC',
  }],
};

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

  describe('groups sections by professor name and orders by section number', () => {
    test('even if the backend separates a professor\'s sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      const csce121Dummy = {
        ...dummySectionArgs, subject: 'CSCE', course_num: '121',
      };
      fetchMock.mockResponseOnce(JSON.stringify([ // api/sections
        {
          ...csce121Dummy,
          section_num: '501',
          instructor_name: 'Shawn Lupoli',
        },
        {
          ...csce121Dummy,
          section_num: '503',
          instructor_name: 'Eun Kim',
        },
        {
          ...csce121Dummy,
          section_num: '505',
          instructor_name: 'Shawn Lupoli',
        },
      ]));

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        findAllByText, getByLabelText, findByText, getByText,
      } = render(
        <Provider store={store}>
          <CourseSelectCard id={0} />
        </Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await findByText('CSCE 121');
      fireEvent.click(csce121Btn);

      // switch to section view
      fireEvent.click(getByText('Section'));
      const lupoliLabels = await findAllByText('Shawn Lupoli');
      const profLabels = await findAllByText(/(Eun Kim)|(Shawn Lupoli)/);

      // assert
      // assert that sections are grouped by professor
      expect(lupoliLabels).toHaveLength(1);
      // assert that sections are sorted by lowest section number
      expect(profLabels[0]).toHaveTextContent('Shawn Lupoli');
      expect(profLabels[1]).toHaveTextContent('Eun Kim');
    });

    test('if all sections have the same professor', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      const tbaDummy = {
        ...dummySectionArgs, subject: 'CSCE', course_num: '121', instructor_name: 'TBA',
      };
      const sectionNums = ['201', '501', '205', '567'];
      const sectionNumsRegex = new RegExp(`(${sectionNums.join(')|(')})`);
      const sortedSectionNums = ['201', '205', '501', '567'];
      fetchMock.mockResponseOnce(JSON.stringify( // api/sections
        sectionNums.map((secNum) => ({
          ...tbaDummy,
          section_num: secNum,
          honors: secNum.startsWith('2'),
        })),
      ));

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        findAllByText, getByLabelText, findByText, getByText, getAllByTestId, getAllByText,
      } = render(
        <Provider store={store}>
          <CourseSelectCard id={0} />
        </Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await findByText('CSCE 121');
      fireEvent.click(csce121Btn);

      // switch to section view
      fireEvent.click(getByText('Section'));
      const tbaLabels = await findAllByText('TBA');
      const honorsLabels = getAllByTestId('honors');
      const sectionLabels = getAllByText(
        (content, element) => ignoreInvisible(content, element, sectionNumsRegex),
      ).map((el) => el.textContent);

      // assert
      expect(sectionLabels).toEqual(sortedSectionNums);
      // there should be two groups, one for honors and one for regular
      expect(tbaLabels).toHaveLength(2);
      expect(honorsLabels).toHaveLength(1);
    });

    test('and puts TBA sections last', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
      }));
      const csce121Dummy = {
        ...dummySectionArgs, subject: 'CSCE', course_num: '121',
      };
      fetchMock.mockResponseOnce(JSON.stringify([ // api/sections
        {
          ...csce121Dummy,
          section_num: '501',
          instructor_name: 'TBA',
        },
        {
          ...csce121Dummy,
          section_num: '503',
          instructor_name: 'ZZ Top',
        },
      ]));

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        findAllByText, getByLabelText, findByText, getByText,
      } = render(
        <Provider store={store}>
          <CourseSelectCard id={0} />
        </Provider>,
      );

      // act
      // fill in course
      const courseEntry = getByLabelText('Course') as HTMLInputElement;
      fireEvent.change(courseEntry, { target: { value: 'CSCE ' } });
      const csce121Btn = await findByText('CSCE 121');
      fireEvent.click(csce121Btn);

      // switch to section view
      fireEvent.click(getByText('Section'));
      const profLabels = await findAllByText(/(TBA)|(ZZ Top)/);

      // assert
      // assert that sections are sorted by lowest section number
      expect(profLabels[0]).toHaveTextContent('ZZ Top');
      expect(profLabels[1]).toHaveTextContent('TBA');
    });
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

      const { getByText, getByLabelText, getAllByText } = render(
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
      const course1Sections = (await waitFor(() => getAllByText(/50\d/))).length;

      // change course and read sections again
      fireEvent.change(courseEntry, { target: { value: 'MATH 15' } });
      const math151Btn = await waitFor(() => getByText('MATH 151'));
      fireEvent.click(math151Btn);
      const course2Sections = (await waitFor(() => getAllByText(/20\d/))).length;

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

  describe('handles honors icon', () => {
    test('by showing it for honors sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['MATH 151'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, findByText, findByTestId,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      fireEvent.change(getByLabelText('Course'), { target: { value: 'M' } });
      fireEvent.click(await findByText('MATH 151'));

      // switch to sections view
      fireEvent.click(getByText('Section'));
      const honorsIcon = await findByTestId('honors');

      // assert
      expect(honorsIcon).toBeInTheDocument();
    });

    test('by hiding it for regular sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121'],
      }));
      fetchMock.mockImplementationOnce(testFetch); // api/sections

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, findByText, queryByTitle,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      fireEvent.change(getByLabelText('Course'), { target: { value: 'C' } });
      fireEvent.click(await findByText('CSCE 121'));

      // switch to sections view
      fireEvent.click(getByText('Section'));
      await findByText((cont, el) => ignoreInvisible(cont, el, '501'));
      const honorsIcon = queryByTitle('honors');

      // assert
      expect(honorsIcon).not.toBeInTheDocument();
    });

    test('if the same professor has both honors and regular sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['MATH 151'],
      }));
      const math151Dummy = {
        ...dummySectionArgs, subject: 'MATH', course_num: 151,
      };
      fetchMock.mockResponseOnce(JSON.stringify([ // api/sections
        {
          ...math151Dummy,
          section_num: '201',
          instructor_name: 'Aakash Tyagi',
          honors: true,
        },
        {
          ...math151Dummy,
          section_num: '502',
          instructor_name: 'Aakash Tyagi',
          honors: false,
        },
      ]));

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      const {
        getByText, getByLabelText, findByText, findAllByText,
      } = render(
        <Provider store={store}><CourseSelectCard id={0} /></Provider>,
      );

      // act
      fireEvent.change(getByLabelText('Course'), { target: { value: 'M' } });
      fireEvent.click(await findByText('MATH 151'));

      // switch to sections view
      fireEvent.click(getByText('Section'));
      const profNames = await findAllByText('Aakash Tyagi');
      expect(profNames).toHaveLength(2);
      const honorsSection = profNames[0];
      const regularSection = profNames[1];

      // assert
      expect(queryByTitleIn(honorsSection, 'Honors')).toBeInTheDocument();
      expect(queryByTitleIn(regularSection, 'Honors')).not.toBeInTheDocument();
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
        const placeholder = await findByText('There are no honors or online courses for this class');

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
      const placeholder = 'There are no honors or online courses for this class';
      expect(queryByText(placeholder)).not.toBeInTheDocument();
    });

    test('when the customization filter is Section and there are sections', async () => {
      // arrange
      fetchMock.mockResponseOnce(JSON.stringify({ // api/course/search
        results: ['CSCE 121', 'CSCE 221', 'CSCE 312'],
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
  describe('SectionSelect', () => {
    describe('shows ONLINE', () => {
      test('for 00:00 meeting times & online section', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

        const {
          getByText,
        } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        const testSection = new Section({
          id: 0,
          crn: 0,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '200',
          minCredits: 3,
          maxCredits: null,
          currentEnrollment: 0,
          maxEnrollment: 0,
          instructor: new Instructor({
            name: 'Test',
          }),
          honors: false,
          web: true,
          grades: null,
        });
        const testMeeting = new Meeting({
          id: 1,
          building: '',
          meetingDays: new Array(7).fill(true),
          startTimeHours: 0,
          startTimeMinutes: 0,
          endTimeHours: 0,
          endTimeMinutes: 0,
          meetingType: MeetingType.LEC,
          section: testSection,
        });

        const sectionSelected = {
          section: testSection,
          meetings: [testMeeting],
          selected: false,
        };

        // Add the SectionSelected type to the store so it shows up in the SectionSelect component
        store.dispatch<any>(updateCourseCard(0, {
          sections: [sectionSelected],
        }, '201931'));

        // assert
        expect(getByText('ONLINE')).toBeTruthy();
      });
    });

    describe('does not show ONLINE', () => {
      test('for 00:00 meeting times that are not online sections', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

        const {
          queryByText,
        } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        const testSection = new Section({
          id: 0,
          crn: 0,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '200',
          minCredits: 3,
          maxCredits: null,
          currentEnrollment: 0,
          maxEnrollment: 0,
          instructor: new Instructor({
            name: 'Test',
          }),
          honors: false,
          web: false,
          grades: null,
        });
        const testMeeting = new Meeting({
          id: 1,
          building: '',
          meetingDays: new Array(7).fill(true),
          startTimeHours: 0,
          startTimeMinutes: 0,
          endTimeHours: 0,
          endTimeMinutes: 0,
          meetingType: MeetingType.LEC,
          section: testSection,
        });

        const sectionSelected = {
          section: testSection,
          meetings: [testMeeting],
          selected: false,
        };

        // Add the SectionSelected type to the store so it shows up in the SectionSelect component
        store.dispatch<any>(updateCourseCard(0, {
          sections: [sectionSelected],
        }, '201931'));

        // assert
        expect(queryByText('ONLINE')).not.toBeInTheDocument();
      });
    });
  });
});
