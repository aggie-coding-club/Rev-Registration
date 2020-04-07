import { createStore } from 'redux';
import autoSchedulerReducer from '../../redux/reducer';
import { addSchedule, removeSchedule } from '../../redux/actions/schedules';
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
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
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
  instructor: new Instructor({
    name: 'Bad Bunny',
  }),
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
  instructor: new Instructor({
    name: 'Creed Cratton',
  }),
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

describe('Schedule Redux', () => {
  describe('adds schedules', () => {
    test('when given multiple schedules', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const schedule1: Meeting[] = [
        testMeeting1,
        testMeeting2,
      ];
      const schedule2: Meeting[] = [
        testMeeting4,
        testMeeting3,
      ];

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));

      // assert
      expect(store.getState().schedules).toContainEqual(schedule1);
      expect(store.getState().schedules).toContainEqual(schedule2);
    });
  });
  describe('removes schedules', () => {
    test('when the middle schedule is deleted', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
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

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(addSchedule(schedule3));
      store.dispatch(removeSchedule(0));

      // assert
      expect(store.getState().schedules).not.toContainEqual(schedule1);
      expect(store.getState().schedules).toContainEqual(schedule2);
      expect(store.getState().schedules).toContainEqual(schedule3);
    });
    test('when the middle schedule is deleted', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
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

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(addSchedule(schedule3));
      store.dispatch(removeSchedule(1));

      // assert
      expect(store.getState().schedules).toContainEqual(schedule1);
      expect(store.getState().schedules).not.toContainEqual(schedule2);
      expect(store.getState().schedules).toContainEqual(schedule3);
    });
    test('when the last schedule is deleted', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
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

      // act
      store.dispatch(addSchedule(schedule1));
      store.dispatch(addSchedule(schedule2));
      store.dispatch(addSchedule(schedule3));
      store.dispatch(removeSchedule(2));

      // assert
      expect(store.getState().schedules).toContainEqual(schedule1);
      expect(store.getState().schedules).toContainEqual(schedule2);
      expect(store.getState().schedules).not.toContainEqual(schedule3);
    });
  });
});
