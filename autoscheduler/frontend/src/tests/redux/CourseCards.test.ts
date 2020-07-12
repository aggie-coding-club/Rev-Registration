import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import { parseSectionSelected, clearCourseCards, replaceCourseCards } from '../../redux/actions/courseCards';
import testFetch from '../testData';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Grades from '../../types/Grades';
import { CustomizationLevel } from '../../types/CourseCardOptions';

// The input from the backend use snake_case, so disable camelcase errors for this file
/* eslint-disable @typescript-eslint/camelcase */
describe('Course Cards Redux', () => {
  describe('parseSections', () => {
    describe('parses correctly', () => {
      test('on a normal input', () => {
        // arrange
        const grades = {
          gpa: 4.0, A: 1, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, Q: 0, X: 0,
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

  describe('deletes all course cards and resets numCardsCreated', () => {
    test('when clearCourseCards is dispatched', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

      // act
      store.dispatch(clearCourseCards());

      // assert
      expect(store.getState().courseCards).toEqual({ numCardsCreated: 0 });
    });
  });

  describe('replaces all course cards and keeps attributes not related to sections', () => {
    test('when replaceCourseCards is dispatched', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const courseCards = {
        0: {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
        },
        numCardsCreated: 1,
      };
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      expect(store.getState().courseCards).toMatchObject(courseCards);
    });
  });

  describe('adds non-existing sections for course cards', () => {
    test('when replaceCourseCards is dispatched', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const courseCards = {
        0: {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
        },
        numCardsCreated: 1,
      };
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      // testFetch with a MATH course has 1 section, which should be added
      expect(store.getState().courseCards[0].sections).toHaveLength(1);
    });
  });

  describe('keeps selected sections from courseCards', () => {
    test('when replaceCourseCards is dispatched', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      // section has the same id as the section returned by testFetch,
      // so it should stay selected
      const section = new Section({
        id: 830262,
        crn: 1,
        subject: 'MATH',
        courseNum: '151',
        sectionNum: '201',
        minCredits: 3,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        honors: true,
        web: true,
        instructor: new Instructor({ name: '名無し先生' }),
        grades: null,
      });

      const sectionSelected = { section, meetings: [] as Meeting[], selected: true };

      const courseCards = {
        0: {
          course: 'MATH 151',
          customizationLevel: CustomizationLevel.BASIC,
          sections: [sectionSelected],
        },
        numCardsCreated: 1,
      };
      fetchMock.mockImplementationOnce(testFetch);

      // act
      store.dispatch<any>(replaceCourseCards(courseCards, '202031'));
      // wait for all actions to finish
      await new Promise(setImmediate);

      // assert
      // testFetch with a MATH course has 1 section
      expect(store.getState().courseCards[0].sections[0].selected).toBeTruthy();
    });
  });
});
