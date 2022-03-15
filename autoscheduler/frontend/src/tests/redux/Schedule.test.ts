import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import autoSchedulerReducer from '../../redux/reducer';
import {
  addSchedule, removeSchedule, replaceSchedules, saveSchedule,
  unsaveSchedule, renameSchedule, setSchedules, generateSchedules,
} from '../../redux/actions/schedules';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import { addCourseCard, updateCourseCard } from '../../redux/actions/courseCards';
import setTerm from '../../redux/actions/term';

const testSectionA = new Section({
  id: 123456,
  crn: 123456,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '200',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 24,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testSectionB = new Section({
  id: 293837,
  crn: 293837,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '201',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 25,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({
    name: 'Bad Bunny',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testSectionC = new Section({
  id: 293838,
  crn: 293838,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '201',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 25,
  honors: false,
  remote: false,
  asynchronous: false,
  instructor: new Instructor({
    name: 'Creed Cratton',
  }),
  grades: null,
  instructionalMethod: InstructionalMethod.NONE,
});

const testMeeting1 = new Meeting({
  id: 12345,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSectionA,
});

const testMeeting2 = new Meeting({
  id: 123456,
  building: 'ZACH',
  meetingDays: [false, false, true, false, true, false, false],
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSectionA,
});

const testMeeting3 = new Meeting({
  id: 234561,
  building: 'ETB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 11,
  startTimeMinutes: 30,
  endTimeHours: 12,
  endTimeMinutes: 20,
  meetingType: MeetingType.LAB,
  section: testSectionB,
});

const testMeeting4 = new Meeting({
  id: 12350,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSectionB,
});

const testMeeting5 = new Meeting({
  id: 55555,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSectionC,
});

const testMeeting6 = new Meeting({
  id: 66666,
  building: 'ZACH',
  meetingDays: [false, false, true, false, true, false, false],
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSectionC,
});

const schedule1: Meeting[] = [
  testMeeting1,
  testMeeting2,
];

const schedule2: Meeting[] = [
  testMeeting3,
  testMeeting4,
];

const schedule3: Meeting[] = [
  testMeeting5,
  testMeeting6,
];

describe('Schedule Redux', () => {
  describe('adds schedules', () => {
    test('when given multiple schedules', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));

      // assert
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule1);
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule2);
    });
  });

  describe('removes schedules', () => {
    test('when the first schedule is deleted', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(addSchedule(schedule3));
      store.dispatch(removeSchedule(0));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(2);
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule2);
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule3);
    });

    test('when the middle schedule is deleted', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(addSchedule(schedule3));
      store.dispatch(removeSchedule(1));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(2);
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule1);
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule3);
    });

    test('when the last schedule is deleted', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(addSchedule(schedule3));
      store.dispatch(removeSchedule(2));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(2);
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule1);
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule2);
    });
  });

  describe('replaces all schedules', () => {
    test('when none are locked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(2);
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule2);
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule3);
    });

    test('when a schedule is locked and then unlocked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(unsaveSchedule(0));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(2);
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule2);
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule3);
    });
  });

  describe('replaces only unlocked schedules', () => {
    test('when a schedule not in the new schedules has been locked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(3);
      expect(store.getState().termData.schedules[0]).toMatchObject({
        meetings: schedule1,
        locked: true,
      });
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule2);
      expect(store.getState().termData.schedules[2].meetings).toEqual(schedule3);
    });

    test('when the new schedules contain a schedule identical to a locked one', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      // schedule1 is [testMeeting1, testMeeting2]
      const schedule4 = [testMeeting2, testMeeting1];

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(replaceSchedules([schedule4]));

      // assert
      // only one schedule should be locked since the schedules are equal
      expect(store.getState().termData.schedules).toHaveLength(1);
      expect(store.getState().termData.schedules[0].meetings).toEqual(schedule1);
    });
  });

  describe('locks the correct schedule', () => {
    test('when the schedule at a non-zero index is locked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(saveSchedule(1));
      store.dispatch(replaceSchedules([schedule3]));

      // assert
      expect(store.getState().termData.schedules).toHaveLength(2);
      expect(store.getState().termData.schedules[0]).toMatchObject({
        meetings: schedule2,
        locked: true,
      });
      expect(store.getState().termData.schedules[1].meetings).toEqual(schedule3);
    });
  });

  describe('unlocks the correct schedule', () => {
    test('when the schedule at index 0 is locked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(saveSchedule(0));
      store.dispatch(saveSchedule(1));
      store.dispatch(unsaveSchedule(0));

      // assert
      expect(store.getState().termData.schedules[0].locked).toBe(false);
      expect(store.getState().termData.schedules[1].locked).toBe(true);
    });

    test('when the schedule at a non-zero index is unlocked', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(saveSchedule(0));
      store.dispatch(saveSchedule(1));
      store.dispatch(unsaveSchedule(1));

      // assert
      expect(store.getState().termData.schedules[0].locked).toBe(true);
      expect(store.getState().termData.schedules[1].locked).toBe(false);
    });
  });

  describe('correctly renames a schedule', () => {
    test('when the first schedule is renamed', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, {
        termData: {
          schedules: [
            {
              meetings: schedule1,
              name: 'Schedule 1',
              locked: false,
            },
          ],
        },
      });
      const scheduleName = 'Test schedule';

      // act
      store.dispatch(renameSchedule(0, scheduleName));

      // assert
      expect(store.getState().termData.schedules[0].name).toBe(scheduleName);
    });

    test('when the second schedule is renamed', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, {
        termData: {
          schedules: [
            {
              meetings: schedule1,
              name: 'Schedule 1',
              locked: false,
            },
            {
              meetings: schedule2,
              name: 'Schedule 2',
              locked: false,
            },
          ],
        },
      });
      const scheduleName = 'Test schedule';

      // act
      store.dispatch(renameSchedule(1, scheduleName));

      // assert
      expect(store.getState().termData.schedules[1].name).toBe(scheduleName);
    });
  });

  // these tests are agnostic to the new names of schedules, it just checks that they're unique
  describe('creates unique names for each schedule', () => {
    test('when a schedule is renamed to an existing name', () => {
      // arrange
      const schedule1Name = 'Schedule 1';
      const store = createStore(autoSchedulerReducer, {
        termData: {
          schedules: [
            {
              meetings: schedule1,
              name: schedule1Name,
              locked: false,
            },
            {
              meetings: schedule2,
              name: 'Schedule 2',
              locked: false,
            },
          ],
        },
      });

      // act
      store.dispatch(renameSchedule(1, schedule1Name));

      // assert
      const uniqueNames = new Set(
        store.getState().termData.schedules.map((schedule) => schedule.name),
      );
      expect(uniqueNames.size).toBe(2);
    });

    test('when schedules are replaced and a new schedule has the same name as a locked one', () => {
      // arrange
      const defaultScheduleName = 'Schedule 1';
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(replaceSchedules([schedule1]));
      // condition for test to be valid: first generated schedule should have defaultScheduleName
      expect(store.getState().termData.schedules[0].name).toBe(defaultScheduleName);
      store.dispatch(saveSchedule(0));
      store.dispatch(replaceSchedules([schedule2]));

      // assert
      // new schedule should have been generated with the name 'Schedule 1'
      const uniqueNames = new Set(
        store.getState().termData.schedules.map((schedule) => schedule.name),
      );
      expect(uniqueNames.size).toBe(2);
    });
  });

  describe('sets schedules', () => {
    test('when the terms match up', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031'));

      const fullSchedule1 = {
        name: 'Name1',
        meetings: schedule1,
        locked: true,
      };

      // act
      store.dispatch(setSchedules([fullSchedule1], '202031'));

      // assert
      expect(store.getState().termData.schedules.length).toEqual(1);
      expect(store.getState().termData.schedules[0]).toEqual(fullSchedule1);
    });
  });

  describe('skips set schedules', () => {
    test("when there's a term mismatch", () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031'));

      const fullSchedule1 = {
        name: 'Name1',
        meetings: schedule1,
        locked: true,
      };

      // act
      store.dispatch(setSchedules([fullSchedule1], '201931'));

      // assert
      expect(store.getState().termData.schedules.length).toEqual(0);
    });
  });

  describe('generateSchedules', () => {
    test('does not send disabled course cards', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      fetchMock.mockResponseOnce('{}'); // api/sections
      fetchMock.mockResponseOnce('{}'); // api/sections
      fetchMock.mockResponseOnce('[]'); // scheduler/generate

      store.dispatch(setTerm('202031'));

      store.dispatch<any>(updateCourseCard(0, {
        disabled: true,
      }, '202031'));

      store.dispatch<any>(updateCourseCard(0, {
        course: 'CSCE 121',
      }, '202031'));

      // Add a course card that will be sent with /scheduler/generate
      store.dispatch<any>(addCourseCard('202031'));
      store.dispatch<any>(updateCourseCard(1, {
        course: 'MATH 151',
      }, '202031'));

      // act
      store.dispatch<any>(generateSchedules());

      // Third call is the /scheduler/generate call. Second index of that call is the body
      const { body } = fetchMock.mock.calls[2][1];
      // Convert the body into a string from a Blob, then parse it into an object
      const { courses } = JSON.parse(body.toString());

      // assert
      expect(courses.length).toEqual(1);
      expect(courses[0].subject).toEqual('MATH');
    });
  });
});
