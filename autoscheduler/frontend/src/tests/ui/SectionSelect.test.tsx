import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, queryByTitle as queryByTitleIn } from '@testing-library/react';
import { CourseCardOptions } from '../../types/CourseCardOptions';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import autoSchedulerReducer from '../../redux/reducer';
import setTerm from '../../redux/actions/term';
import { updateCourseCard } from '../../redux/actions/courseCards';
import SectionSelect from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionSelect';

const dummySection: Section = {
  id: 123456,
  crn: 123456,
  sectionNum: '501',
  subject: 'ABCD',
  courseNum: '1234',
  minCredits: 0,
  maxCredits: 0,
  currentEnrollment: 25,
  maxEnrollment: 25,
  web: false,
  honors: false,
  instructor: new Instructor({ name: 'Dr. Doofenschmirtz' }),
  grades: null,
};

const dummyMeeting: Meeting = {
  id: 98765,
  building: 'ACAD',
  startTimeHours: 8,
  startTimeMinutes: 0,
  endTimeHours: 8,
  endTimeMinutes: 50,
  meetingDays: [true, true, true, true, true, true, true],
  meetingType: MeetingType.LEC,
  section: dummySection,
};

/**
 * Helper function that makes a course card. Each argument supplied will be used as the props
 * of a section in the card, and each section will have a single, un-customizaable meeting.
 * Supplying multiple arguments will create multiple sections.
 * @param args properties of the section that matter for this test
 */
function makeCourseCard(...args: any): CourseCardOptions {
  return {
    sections: args.map((props: any) => {
      const section: Section = {
        ...dummySection,
        ...props,
      };
      return {
        section,
        meetings: [{
          ...dummyMeeting,
          section,
        }],
        selected: false,
      };
    }),
  };
}

describe('SectionSelect', () => {
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
      const profNames = await findAllByText('Aakash Tyagi');
      expect(profNames).toHaveLength(2);
      const honorsSection = profNames[0];
      const regularSection = profNames[1];

      // assert
      expect(queryByTitleIn(honorsSection, 'Honors')).toBeInTheDocument();
      expect(queryByTitleIn(regularSection, 'Honors')).not.toBeInTheDocument();
    });
  });

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
        web: true,
        grades: null,
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
        web: true,
        grades: null,
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
        web: true,
        grades: null,
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
        web: true,
        grades: null,
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
      expect(getAllByText(/(EXAM)|(LEC)/)).toHaveLength(2);
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
});
