import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import fetchMock from 'jest-fetch-mock';
import autoSchedulerReducer from '../../redux/reducer';
import { addCourseCard, removeCourseCard, updateCourseCard } from '../../redux/actions/courseCards';
import { addMeeting, removeMeeting, replaceMeetings } from '../../redux/actions/meetings';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import { CustomizationLevel } from '../../types/CourseCardOptions';

const testSection = new Section({
  id: 123456,
  crn: 123456,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '200',
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 0,
  maxEnrollment: 0,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
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
  section: testSection,
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
  section: testSection,
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
  section: testSection,
});

beforeAll(() => fetchMock.enableMocks());

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
  expect(store.getState().meetings).toEqual([testMeeting2]);
});

test('Replaces multiple meetings', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addMeeting(testMeeting1));
  store.dispatch(addMeeting(testMeeting2));
  store.dispatch(replaceMeetings([testMeeting2, testMeeting3]));

  // assert
  expect(store.getState().meetings).toEqual([testMeeting2, testMeeting3]);
});

test('Initial state has one empty course card', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // asssert
  expect(store.getState().courseCards).toEqual({
    0: {
      course: '',
      customizationLevel: CustomizationLevel.BASIC,
      web: 'include',
      honors: 'include',
      sections: [],
    },
    numCardsCreated: 1,
  });
});

test('Adds an empty course card', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addCourseCard());

  // assert
  expect(store.getState().courseCards.numCardsCreated).toEqual(2);
  expect(store.getState().courseCards[1]).not.toBeUndefined();
});

test('Removes a course card', () => {
  // arrange
  const store = createStore(autoSchedulerReducer);

  // act
  store.dispatch(addCourseCard());
  store.dispatch(addCourseCard());
  store.dispatch(removeCourseCard(1));

  // assert
  expect(store.getState().courseCards.numCardsCreated).toEqual(3);
  expect(store.getState().courseCards[1]).toBeUndefined();
  expect(store.getState().courseCards[2]).not.toBeUndefined();
});

test('Updates course card string field', () => {
  // arrange
  fetchMock.mockOnce('[]');
  const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

  // act
  store.dispatch<any>(updateCourseCard(0, { course: 'PSYC 107' }, '201931'));

  // assert
  expect(store.getState().courseCards[0].course).toEqual('PSYC 107');
});

test('Updates course card basic filter options', () => {
  // arrange
  fetchMock.mockOnce('[]');
  const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));

  // act
  store.dispatch<any>(updateCourseCard(0, { web: 'exclude' }));

  // assert
  expect(store.getState().courseCards[0].web).toBe('exclude');
});
