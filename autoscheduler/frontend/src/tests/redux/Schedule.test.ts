import { createStore } from 'redux';
import autoSchedulerReducer from '../../redux/reducer';
import {
  addSchedule, removeSchedule, replaceSchedules, saveSchedule,
  unsaveSchedule,
} from '../../redux/actions/schedules';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';

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
  web: false,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
  grades: null,
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
  web: false,
  instructor: new Instructor({
    name: 'Bad Bunny',
  }),
  grades: null,
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
  web: false,
  instructor: new Instructor({
    name: 'Creed Cratton',
  }),
  grades: null,
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
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
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
      expect(store.getState().schedules.allSchedules).not.toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
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
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).not.toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
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
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).not.toContainEqual(schedule3);
    });
  });

  describe('replaces all schedules', () => {
    test('when none are saved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().schedules.allSchedules).not.toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
    });

    test('when a schedule is saved and then unsaved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(unsaveSchedule(0));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().schedules.allSchedules).not.toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
    });
  });

  describe('replaces only unsaved schedules', () => {
    test('when a schedule not in the new schedules has been saved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
    });

    test('when the new schedules contain a schedule identical to a saved one', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      // schedule1 is [testMeeting1, testMeeting2]
      const schedule4 = [testMeeting2, testMeeting1];

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(replaceSchedules([schedule4]));

      // assert
      // only one schedule should be saved since the schedules are equal
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toHaveLength(1);
    });
  });

  describe('saves the correct schedule', () => {
    test('when the schedule at index 0 is saved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(saveSchedule(0));
      store.dispatch(replaceSchedules([schedule2, schedule3]));

      // assert
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
    });

    test('when the schedule at a non-zero index is saved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(saveSchedule(1));
      store.dispatch(replaceSchedules([schedule3]));

      // assert
      expect(store.getState().schedules.allSchedules).not.toContainEqual(schedule1);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule2);
      expect(store.getState().schedules.allSchedules).toContainEqual(schedule3);
    });
  });

  describe('unsaves the correct schedule', () => {
    test('when the schedule at index 0 is saved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(saveSchedule(0));
      store.dispatch(saveSchedule(1));
      store.dispatch(unsaveSchedule(0));

      // assert
      expect(store.getState().schedules.savedSchedules).not.toContainEqual(schedule1);
      expect(store.getState().schedules.savedSchedules).toContainEqual(schedule2);
    });

    test('when the schedule at a non-zero index is unsaved', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(saveSchedule(0));
      store.dispatch(saveSchedule(1));
      store.dispatch(unsaveSchedule(1));

      // assert
      expect(store.getState().schedules.savedSchedules).toContainEqual(schedule1);
      expect(store.getState().schedules.savedSchedules).not.toContainEqual(schedule2);
    });
  });
});
