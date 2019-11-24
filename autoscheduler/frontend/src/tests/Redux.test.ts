import { createStore } from 'redux';
import autoSchedulerReducer from '../redux/reducers';
import { addMeeting, removeMeeting, replaceMeetings } from '../redux/actions';
import Section from '../types/Section';
import Instructor from '../types/Instructor';
import Meeting, { MeetingType } from '../types/Meeting';

const testSection = new Section({
  id: 123456,
  subject: 'CSCE',
  courseNum: 121,
  sectionNum: 200,
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  instructor: new Instructor({
    id: 123456,
    name: 'Aakash Tyagi',
  }),
});

const testMeeting1 = new Meeting({
  id: 12345,
  crn: 123456,
  building: 'HRBB',
  meetingDays: new Array(7).fill(true),
  startTimeHours: 10,
  startTimeMinutes: 20,
  endTimeHours: 11,
  endTimeMinutes: 10,
  meetingType: MeetingType.LEC,
  section: testSection,
});

const testMeeting2 = new Meeting({
  id: 123456,
  crn: 123456,
  building: 'ZACH',
  meetingDays: [false, false, true, false, true, false, false],
  startTimeHours: 15,
  startTimeMinutes: 0,
  endTimeHours: 17,
  endTimeMinutes: 50,
  meetingType: MeetingType.LAB,
  section: testSection,
});

test('Initial state has empty meetings', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // assert
  expect(store.getState().meetings).toHaveLength(0);
});

test('Adds meeting to store', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));

  // assert
  expect(store.getState().meetings).toHaveLength(1);
});

test('Removes meeting from store', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));
  store.dispatch(removeMeeting(testMeeting1));

  // assert
  expect(store.getState().meetings).toHaveLength(0);
});

test('Replaces single meeting', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));
  store.dispatch(replaceMeetings([testMeeting2]));

  // assert
  expect(store.getState().meetings).toHaveLength(1);
  expect(store.getState().meetings).toContain(testMeeting2);
  expect(store.getState().meetings).not.toContain(testMeeting1);
});
