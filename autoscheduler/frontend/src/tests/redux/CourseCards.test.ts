import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { createStore, applyMiddleware } from 'redux';
import { waitFor } from '@testing-library/react';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import {
  parseSectionSelected, clearCourseCards, replaceCourseCards, addCourseCard,
} from '../../redux/actions/courseCards';
import testFetch from '../testData';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Grades from '../../types/Grades';
import { CustomizationLevel, CourseCardArray, SerializedCourseCardOptions } from '../../types/CourseCardOptions';
import setTerm from '../../redux/actions/term';

// The input from the backend use snake_case, so disable camelcase errors for this file
/* eslint-disable @typescript-eslint/camelcase */
describe('Course Cards Redux', () => {
  describe('parseSections', () => {
    describe('parses correctly', () => {
      test('on a normal input', () => {
        // arrange
        const grades = {
          gpa: 4.0, A: 1, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, U: 0, Q: 0, X: 0, count: 0,
        };

        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          web: false,
          honors: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
          grades,
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          honors: false,
          web: false,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: new Grades(grades),
        });

        const meetings = [new Meeting({
          id: 11,
          building: '',
          meetingDays: [true, false, false, false, false, false, false],
          startTimeHours: 8,
          startTimeMinutes: 0,
          endTimeHours: 8,
          endTimeMinutes: 50,
          meetingType: MeetingType.LEC,
          section,
        })];
        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });

      test('with null maxCredits', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          web: false,
          honors: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: null,
          currentEnrollment: 0,
          maxEnrollment: 1,
          honors: false,
          web: false,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null,
        });

        const meetings = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 8,
            startTimeMinutes: 0,
            endTimeHours: 8,
            endTimeMinutes: 50,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });
    });

    describe('sets start/end time to 00:00', () => {
      test('when start/end time are null', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          web: false,
          honors: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              type: 'LEC',
            },
          ],
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          honors: false,
          web: false,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null,
        });

        const meetings = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 0,
            startTimeMinutes: 0,
            endTimeHours: 0,
            endTimeMinutes: 0,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });
    });

    describe('Grades is null', () => {
      test('When its given as null', () => {
        // arrange
        const input = [{
          id: 1,
          crn: 1,
          subject: 'CSCE',
          course_num: '121',
          section_num: '500',
          min_credits: 3,
          max_credits: 3,
          current_enrollment: 0,
          max_enrollment: 1,
          instructor_name: 'Instructor Name',
          web: false,
          honors: false,
          meetings: [
            {
              id: 11,
              days: [true, false, false, false, false, false, false],
              start_time: '08:00',
              end_time: '08:50',
              type: 'LEC',
            },
          ],
          grades: null as any,
        }];

        const section = new Section({
          id: 1,
          crn: 1,
          subject: 'CSCE',
          courseNum: '121',
          sectionNum: '500',
          minCredits: 3,
          maxCredits: 3,
          currentEnrollment: 0,
          maxEnrollment: 1,
          instructor: new Instructor({ name: 'Instructor Name' }),
          grades: null as any,
          web: false,
          honors: false,
        });

        const meetings = [
          new Meeting({
            id: 11,
            building: '',
            meetingDays: [true, false, false, false, false, false, false],
            startTimeHours: 8,
            startTimeMinutes: 0,
            endTimeHours: 8,
            endTimeMinutes: 50,
            meetingType: MeetingType.LEC,
            section,
          }),
        ];

        const expected = [{ section, meetings, selected: false }];

        // act
        const output = parseSectionSelected(input);

        // assert
        expect(output).toEqual(expected);
      });
    });
  });

  describe('clearCourseCards', () => {
    test('resets course cards to initial state', () => {
      // arrange
      const expected: CourseCardArray = {
        numCardsCreated: 1,
        0: {
          course: '',
          customizationLevel: CustomizationLevel.BASIC,
          web: 'no_preference',
          honors: 'exclude',
          sections: [],
        },
      };
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      // add another course card, should be removed by clearCourseCards()
      store.dispatch(addCourseCard({}));

      // act
      store.dispatch(clearCourseCards());

      // assert
      expect(store.getState().courseCards).toMatchObject(expected);
    });
  });

  describe('replaceCourseCards', () => {
    test('replaces all course cards and keeps all properties not related to sections', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const expectedCourseCards: CourseCardArray = {
        0: {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          web: 'no_preference',
          honors: 'exclude',
        },
        numCardsCreated: 1,
      };
      const courseCards = [
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          web: 'no_preference',
          honors: 'exclude',
        },
      ];
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      expect(store.getState().courseCards).toMatchObject(expectedCourseCards);
    });

    test('adds new sections for course cards', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // Set the current term, as updateCourseCard will not go through if the term in the
      // store is undefined due to term mismatch checking
      const term = '202031';
      store.dispatch(setTerm(term));

      const courseCards: SerializedCourseCardOptions[] = [
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
        },
      ];
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, term));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      // testFetch with a MATH course has 1 section, which should be added
      expect(store.getState().courseCards[0].sections).toHaveLength(1);
    });

    test('keeps selected sections from courseCards', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // Set the current term, as updateCourseCard will not go through if the term in the
      // store is undefined due to term mismatch checking
      const term = '202031';
      store.dispatch(setTerm(term));

      // section is the id of the section returned by testFetch, should be checked
      const section = 830262;
      fetchMock.mockImplementationOnce(testFetch);

      const courseCards: SerializedCourseCardOptions[] = [
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          sections: [section],
        },
      ];

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, term));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      // testFetch with a MATH course has 1 section
      expect(store.getState().courseCards[0].sections[0].selected).toBeTruthy();
    });

    test('maintains card order when fetches finish out of order', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      // wait for second course card to be created to add the first one
      fetchMock.mockImplementationOnce(async (course: string) => {
        await waitFor(() => store.getState().courseCards[1]);
        return testFetch(course);
      });
      fetchMock.mockImplementationOnce(testFetch);

      const courseCards: SerializedCourseCardOptions[] = [
        {
          course: 'CSCE 121',
          customizationLevel: CustomizationLevel.BASIC,
        },
        {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
        },
      ];

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);
      // have to await again for waitFor to finish
      await new Promise(setImmediate);

      // assert
      expect(store.getState().courseCards.numCardsCreated).toEqual(2);
      expect(store.getState().courseCards[0].course).toEqual('CSCE 121');
      expect(store.getState().courseCards[1].course).toEqual('MATH 151');
    });
  });
});
