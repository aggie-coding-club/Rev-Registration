import Course from '../types/Course';
import { Indexable, fetchMock } from './util';

// arrange
const correctArgs: Indexable = {
  id: '123de45f',
  subject: 'CSCE',
  courseNum: 221,
  title: 'Datastructures & Algorithms',
  description: 'The coolest class ever',
  creditHours: 3,
};
const createCourse = jest.fn((args) => new Course(fetchMock(args)));

test('Course accepts correct arguments', () => {
  // act
  createCourse(correctArgs);

  // assert
  expect(createCourse).toReturn();
});

const nonNullableProps = ['id', 'subject', 'courseNum', 'title'];
test.each(nonNullableProps)('Course rejects null %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = null;

  // act and assert
  expect(() => createCourse(badArgs)).toThrow();
});

test.each(Object.keys(correctArgs))('Course rejects undefined %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = undefined;

  // act and assert
  expect(() => createCourse(badArgs)).toThrow();
});

test('Credit hours must be a number if present', () => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs.creditHours = 'not a number';

  // act and assert
  expect(() => createCourse(badArgs)).toThrow();
});
