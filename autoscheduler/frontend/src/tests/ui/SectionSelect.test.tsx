import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  render, queryByTitle as queryByTitleIn, fireEvent, waitForElementToBeRemoved, findByText,
} from '@testing-library/react';
import { makeCourseCard } from '../util';
import { SortType, SectionFilter, SectionSelected } from '../../types/CourseCardOptions';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import autoSchedulerReducer from '../../redux/reducer';
import setTerm from '../../redux/actions/term';
import { updateCourseCard, updateSortType } from '../../redux/actions/courseCards';
import SectionSelect from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionSelect';
import Section, { InstructionalMethod } from '../../types/Section';


describe('SectionSelect', () => {
  describe('select all button', () => {
    test('is rendered', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({})));

      // act
      const { getByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      expect(await getByText('SELECT ALL')).toBeInTheDocument();
    });

    describe('is checked', () => {
      test('when all sections are selected manually', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard(
          { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 },
        )));
        const { getByText, getAllByDisplayValue } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        // act
        fireEvent.click(getByText('201'));
        fireEvent.click(getByText('202'));

        // assert
        expect(getAllByDisplayValue('all on')).toHaveLength(1);
      });
    });

    describe('is unchecked', () => {
      test('by default', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard({})));

        // act
        const { getAllByDisplayValue } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        // assert
        expect(getAllByDisplayValue('all off')).toHaveLength(1);
      });

      test('when an individual section is unchecked', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard(
          { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 },
        )));
        const { getByText, getAllByDisplayValue } = render(
          <Provider store={store}><SectionSelect id={0} /></Provider>,
        );

        // act
        fireEvent.click(getByText('201'));
        fireEvent.click(getByText('202'));
        fireEvent.click(getByText('201'));

        // assert
        expect(getAllByDisplayValue('all off')).toHaveLength(1);
      });
    });

    test('selects all sections when clicked', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard(
        { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 }, { sectionNum: '203', id: 123458 },
      )));
      const { getByText, getAllByDisplayValue } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // act
      fireEvent.click(getByText('201'));
      fireEvent.click(getByText('201'));
      fireEvent.click(getByText('202'));
      fireEvent.click(getByText('SELECT ALL'));

      // assert
      expect(getAllByDisplayValue('on')).toHaveLength(3);
      expect(getAllByDisplayValue('all on')).toHaveLength(1);
    });

    test('unselects all sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard(
        { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 }, { sectionNum: '203', id: 123458 },
      )));
      const { getByText, getAllByDisplayValue } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // act
      fireEvent.click(getByText('201'));
      fireEvent.click(getByText('202'));
      fireEvent.click(getByText('203'));
      fireEvent.click(getByText('SELECT ALL'));

      // assert
      expect(getAllByDisplayValue('off')).toHaveLength(3);
      expect(getAllByDisplayValue('all off')).toHaveLength(1);
    });
  });
  describe('handles honors icon', () => {
    test('by showing it for honors sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        honors: true,
      })));
      const { findByTestId } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      const honorsIcon = await findByTestId('honors');

      // assert
      expect(honorsIcon).toBeInTheDocument();
    });

    test('by hiding it for regular sections', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        honors: false,
      })));
      const { queryByTitle } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      const honorsIcon = queryByTitle('honors');

      // assert
      expect(honorsIcon).not.toBeInTheDocument();
    });

    test('if the same professor has both honors and regular sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        sectionNum: '201',
        instructor: new Instructor({ name: 'Aakash Tyagi' }),
        honors: true,
      }, {
        sectionNum: '501',
        instructor: new Instructor({ name: 'Aakash Tyagi' }),
        honors: false,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // act
      const profNames = (await findAllByText('Aakash Tyagi')).map((el) => el.parentElement.parentElement.parentElement);
      expect(profNames).toHaveLength(2);
      const honorsSection = profNames[0];
      const regularSection = profNames[1];

      // assert
      expect(queryByTitleIn(honorsSection, 'Honors')).toBeInTheDocument();
      expect(queryByTitleIn(regularSection, 'Honors')).not.toBeInTheDocument();
    });
  });

  describe('shows a single meeting time', () => {
    test('for duplicate exam times', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 0,
        meetingType: MeetingType.EXAM,
        section: testSection,
      });

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting, testMeeting, testMeeting],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText('EXAM')).toHaveLength(1);
    });

    test('for slightly different exam times, as long as they have the same start time', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 30,
        meetingType: MeetingType.EXAM,
        section: testSection,
      });
      const testMeeting2 = {
        ...testMeeting,
        endTimeHours: 21,
        endTimeMinutes: 0,
      };

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting, testMeeting, testMeeting, testMeeting2],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText('EXAM')).toHaveLength(1);
    });

    test('for labs on different days, as long as they have the same start time', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: '',
        meetingDays: [true, false, false, false, false, false, false],
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 30,
        meetingType: MeetingType.LAB,
        section: testSection,
      });
      const testMeeting2 = {
        ...testMeeting,
        meetingDays: [false, true, false, false, false, false, false],
        endTimeHours: 21,
        endTimeMinutes: 0,
      };

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting, testMeeting, testMeeting, testMeeting2],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText('LAB')).toHaveLength(1);
    });
  });

  describe('shows multiple meeting times', () => {
    test('for different meeting types at different times', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      const { getAllByText } = render(
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting1 = new Meeting({
        id: 1,
        building: '',
        meetingDays: new Array(7).fill(true),
        startTimeHours: 19,
        startTimeMinutes: 0,
        endTimeHours: 20,
        endTimeMinutes: 0,
        meetingType: MeetingType.EXAM,
        section: testSection,
      });
      const testMeeting2 = {
        ...testMeeting1,
        startTimeHours: 9,
        startTimeMinutes: 0,
        endTimeHours: 10,
        endTimeMinutes: 30,
        meetingType: MeetingType.LEC,
      };

      const sectionSelected = {
        section: testSection,
        meetings: [testMeeting1, testMeeting2],
        selected: false,
      };

      // Add the SectionSelected type to the store so it shows up in the SectionSelect component
      store.dispatch<any>(updateCourseCard(0, {
        sections: [sectionSelected],
      }, '201931'));

      // assert
      expect(getAllByText(/(EXAM)|(LEC$)/)).toHaveLength(2);
    });
  });

  describe('displays correct number of seats', () => {
    test('when there are no students enrolled', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        currentEnrollment: 0,
        maxEnrollment: 25,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      // verify text for seats is correct
      const sectionText = (await findAllByText(/ seats left/))[0];
      expect(sectionText).toHaveTextContent('25/25 seats left');
      expect(sectionText).not.toHaveStyle('color: red;');
    });

    test('when a section has max enrollment', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        currentEnrollment: 25,
        maxEnrollment: 25,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      // verify text for seats is correct
      const sectionText = (await findAllByText(/ seats left/))[0];
      expect(sectionText).toHaveTextContent('0/25 seats left');
      expect(sectionText).toHaveStyle('color: red;');
    });

    test('when a section has over max enrollment', async () => {
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({
        currentEnrollment: 26,
        maxEnrollment: 25,
      })));
      const { findAllByText } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );

      // assert
      // verify text for seats is correct
      const sectionText = (await findAllByText(/ seats left/))[0];
      expect(sectionText).toHaveTextContent('-1/25 seats left');
      expect(sectionText).toHaveStyle('color: red;');
    });
  });

  describe('shows ONLINE', () => {
    test('if the meeting has no building for online sections', () => {
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: null,
        meetingDays: new Array(7).fill(true),
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 8,
        endTimeMinutes: 50,
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

    test('if the meeting has no building for hybrid sections', () => {
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
        remote: false,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: null,
        meetingDays: new Array(7).fill(true),
        startTimeHours: 8,
        startTimeMinutes: 0,
        endTimeHours: 8,
        endTimeMinutes: 50,
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
        remote: true,
        grades: null,
        asynchronous: false,
        instructionalMethod: InstructionalMethod.NONE,
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

  describe('shows N/A', () => {
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
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
      expect(getByText('N/A')).toBeTruthy();
    });

    test('for 00:00 meeting times & hybrid section', () => {
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
        remote: false,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
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
      expect(getByText('N/A')).toBeTruthy();
    });
  });

  describe('does not show ONLINE', () => {
    test('for meetings that have a building, even if they are marked as remote', () => {
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
        remote: true,
        asynchronous: false,
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      });
      const testMeeting = new Meeting({
        id: 1,
        building: 'BILD',
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
      expect(queryByText('BILD')).toBeInTheDocument();
    });
  });

  describe('keeps the first section checked', () => {
    test('when a second section is also selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      store.dispatch<any>(updateCourseCard(0, makeCourseCard(
        { sectionNum: '201', id: 123456 }, { sectionNum: '202', id: 123457 },
      )));
      const {
        getByText, getAllByDisplayValue,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      // click the first section
      fireEvent.click(getByText('201'));

      // act
      fireEvent.click(getByText('202'));

      // assert
      // should have 2 for individual sections + 1 for professor group
      expect(getAllByDisplayValue('on')).toHaveLength(2);
    });
  });

  describe('section sorting', () => {
    describe('has an icon for sort order that', () => {
      test('exists', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard({
          sectionNum: '201',
          instructor: new Instructor({ name: 'Aakash Tyagi' }),
          honors: true,
        })));

        // act
        const { getByLabelText } = render(
          <Provider store={store}>
            <SectionSelect id={0} />
          </Provider>,
        );

        // assert
        expect(getByLabelText('reverse-sort-order')).not.toBeNull();
      });

      test('responds to state', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard({
          sectionNum: '201',
          instructor: new Instructor({ name: 'Aakash Tyagi' }),
          honors: true,
        })));
        store.dispatch<any>(updateSortType(0, SortType.DEFAULT, false));

        // act
        const { getByLabelText } = render(
          <Provider store={store}>
            <SectionSelect id={0} />
          </Provider>,
        );

        // assert
        expect(getByLabelText('reverse-sort-order').firstChild.firstChild).toHaveClass('sortOrderButtonIconAscending');
      });
    });

    describe('button shows sort text as', () => {
      test('"default" by default', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, makeCourseCard({})));

        // act
        const { getByTestId } = render(
          <Provider store={store}>
            <SectionSelect id={0} />
          </Provider>,
        );

        // assert
        const sortByLabel = getByTestId('sort-by-label');
        // The first child is the "SORT: ", the second is the sort by text
        const sortByText = sortByLabel.childNodes[1].textContent;

        // For some reason we can't match SORT: Default, so this is good enough
        expect(sortByText).toEqual('Default');
      });

      test('as Instructional Method when it is set', () => {
        // arrange
        const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
        store.dispatch(setTerm('201931'));
        store.dispatch<any>(updateCourseCard(0, {
          ...(makeCourseCard({})),
          sortType: SortType.INSTRUCTIONAL_METHOD,
        }));

        // act
        const { getByTestId } = render(
          <Provider store={store}>
            <SectionSelect id={0} />
          </Provider>,
        );

        // assert
        const sortByLabel = getByTestId('sort-by-label');
        // The first child is the "SORT: ", the second is the sort by text
        const sortByText = sortByLabel.childNodes[1].textContent;

        // For some reason we can't match SORT: Instructional Method, so this is good enough
        expect(sortByText).toEqual('Instructional Method');
      });
    });
  });

  describe('filters correctly by', () => {
    // here for efficiency, constant anyways
    const dummySectionArgs: any = {
      id: 0,
      crn: 0,
      subject: 'CSCE',
      courseNum: '121',
      sectionNum: '500',
      minCredits: 3,
      maxCredits: null,
      currentEnrollment: 51,
      maxEnrollment: 50,
      instructor: new Instructor({
        name: 'Test',
      }),
      honors: false,
      remote: false,
      asynchronous: false,
      grades: {
        gpa: 3.0,
      },
    };
    const dummyMeetingArgs: any = {
      id: 1,
      building: 'BILD',
      meetingDays: new Array(7).fill(true),
      startTimeHours: 0,
      startTimeMinutes: 0,
      endTimeHours: 0,
      endTimeMinutes: 0,
      meetingType: MeetingType.LEC,
      section: null,
    };
    const testSections: Section[] = [
      new Section({
        ...dummySectionArgs,
        sectionNum: '501',
        currentEnrollment: 40,
      }),
      new Section({
        ...dummySectionArgs,
        sectionNum: '502',
        honors: true,
      }),
      new Section({
        ...dummySectionArgs,
        sectionNum: '503',
        remote: true,
      }),
      new Section({
        ...dummySectionArgs,
        sectionNum: '504',
        asynchronous: true,
      }),
      new Section({
        ...dummySectionArgs,
        sectionNum: '505',
        currentEnrollment: 40,
        honors: true,
      }),
      new Section({
        ...dummySectionArgs,
        sectionNum: '506',
        remote: true,
        asynchronous: true,
      }),
      new Section({
        ...dummySectionArgs,
        sectionNum: '507',
        currentEnrollment: 40,
        remote: true,
        asynchronous: true,
      }),
    ].map((section, index) => ({ ...section, id: index }));

    const testSectionsSelected: SectionSelected[] = testSections.map((value) => ({
      section: value,
      meetings: [new Meeting({
        ...dummyMeetingArgs,
        section: value,
      })],
      selected: false,
    }));

    test('nothing', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // act
      const {
        getByText, getAllByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} /></Provider>,
      );
      store.dispatch<any>(updateCourseCard(0, {
        sections: [...testSectionsSelected],
        includeFull: true,
        honors: SectionFilter.NO_PREFERENCE,
        remote: SectionFilter.NO_PREFERENCE,
        asynchronous: SectionFilter.NO_PREFERENCE,
      }, '201931'));
      await getByText('501');

      // assert
      const presentSections = getAllByText(/50\d/g).map((x) => x.textContent.trim());
      expect(presentSections.sort()).toEqual(['501', '502', '503', '504', '505', '506', '507']);
    });
    test('include full sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getAllByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} isTesting /></Provider>,
      );
      store.dispatch<any>(updateCourseCard(0, {
        sections: [...testSectionsSelected],
        includeFull: true,
        honors: SectionFilter.NO_PREFERENCE,
        remote: SectionFilter.NO_PREFERENCE,
        asynchronous: SectionFilter.NO_PREFERENCE,
      }, '201931'));
      await getByText('501');

      // act
      store.dispatch<any>(updateCourseCard(0, {
        includeFull: false,
      }));
      await waitForElementToBeRemoved(await getByText('Filtering sections...'));

      // assert
      const presentSections = getAllByText(/50\d/g).map((x) => x.textContent.trim());
      expect(presentSections.sort()).toEqual(['501', '505', '507']);
    });
    test('honors only', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getAllByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} isTesting /></Provider>,
      );
      store.dispatch<any>(updateCourseCard(0, {
        sections: [...testSectionsSelected],
        includeFull: true,
        honors: SectionFilter.NO_PREFERENCE,
        remote: SectionFilter.NO_PREFERENCE,
        asynchronous: SectionFilter.NO_PREFERENCE,
      }, '201931'));
      await getByText('501');

      // act
      store.dispatch<any>(updateCourseCard(0, {
        honors: SectionFilter.ONLY,
      }));
      await waitForElementToBeRemoved(await getByText('Filtering sections...'));

      // assert
      const presentSections = getAllByText(/50\d/g).map((x) => x.textContent.trim());
      expect(presentSections.sort()).toEqual(['502', '505']);
    });
    test('honors exclude', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getAllByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} isTesting /></Provider>,
      );
      store.dispatch<any>(updateCourseCard(0, {
        sections: [...testSectionsSelected],
        includeFull: true,
        honors: SectionFilter.NO_PREFERENCE,
        remote: SectionFilter.NO_PREFERENCE,
        asynchronous: SectionFilter.NO_PREFERENCE,
      }, '201931'));
      await getByText('501');

      // act
      store.dispatch<any>(updateCourseCard(0, {
        honors: SectionFilter.EXCLUDE,
      }));
      await waitForElementToBeRemoved(await getByText('Filtering sections...'));

      // assert
      const presentSections = getAllByText(/50\d/g).map((x) => x.textContent.trim());
      expect(presentSections.sort()).toEqual(['501', '503', '504', '506', '507']);
    });
    test('remote exclude and asynchronous only', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getAllByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} isTesting /></Provider>,
      );
      store.dispatch<any>(updateCourseCard(0, {
        sections: [...testSectionsSelected],
        includeFull: true,
        honors: SectionFilter.NO_PREFERENCE,
        remote: SectionFilter.NO_PREFERENCE,
        asynchronous: SectionFilter.NO_PREFERENCE,
      }, '201931'));
      await getByText('501');

      // act
      store.dispatch<any>(updateCourseCard(0, {
        remote: SectionFilter.EXCLUDE,
        asynchronous: SectionFilter.ONLY,
      }));
      await waitForElementToBeRemoved(await getByText('Filtering sections...'));

      // assert
      const presentSections = getAllByText(/50\d/g).map((x) => x.textContent.trim());
      expect(presentSections.sort()).toEqual(['504']);
    });
    test('everything', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const {
        getByText, getAllByText,
      } = render(
        <Provider store={store}><SectionSelect id={0} isTesting /></Provider>,
      );
      store.dispatch<any>(updateCourseCard(0, {
        sections: [...testSectionsSelected],
        includeFull: true,
        honors: SectionFilter.NO_PREFERENCE,
        remote: SectionFilter.NO_PREFERENCE,
        asynchronous: SectionFilter.NO_PREFERENCE,
      }, '201931'));
      await getByText('501');

      // act
      store.dispatch<any>(updateCourseCard(0, {
        includeFull: false,
        honors: SectionFilter.EXCLUDE,
        remote: SectionFilter.ONLY,
        asynchronous: SectionFilter.ONLY,
      }));
      await waitForElementToBeRemoved(await getByText('Filtering sections...'));

      // assert
      const presentSections = getAllByText(/50\d/g).map((x) => x.textContent.trim());
      expect(presentSections.sort()).toEqual(['507']);
    });
  });
});
