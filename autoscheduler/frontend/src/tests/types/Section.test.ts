import Section from '../../types/Section';
import { Indexable, fetchMock } from '../util';
import Instructor from '../../types/Instructor';

// arrange
const correctArgs: Indexable = {
  id: 123456,
  subject: 'SUBJ',
  courseNum: 234,
  sectionNum: 500,
  minCredits: 3,
  maxCredits: null,
  currentEnrollment: 56,
  instructor: new Instructor({
    name: 'Aakash Tyagi',
  }),
};
const createSection = jest.fn((args) => new Section(fetchMock(args)));

test('Section accepts correct arguments', () => {
  // act
  createSection(correctArgs);

  // assert
  expect(createSection).toReturn();
});

const nonNullableProps = ['id', 'subject', 'courseNum', 'sectionNum', 'minCredits',
  'currentEnrollment', 'instructor'];
test.each(nonNullableProps)('Section rejects null %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = null;

  // act and assert
  expect(() => createSection(badArgs)).toThrow();
});

test.each(Object.keys(correctArgs))('Section rejects undefined %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  // undefined is functionally the same as missing argument
  badArgs[prop] = undefined;

  // act and assert
  expect(() => createSection(badArgs)).toThrow();
});

test('Section rejects float credits', () => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs.minCredits = 3.45;

  // act and assert
  expect(() => createSection(badArgs)).toThrow();
});

test('Section.maxCredits must be an integer if present', () => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs.maxCredits = 2.05;

  // act and assert
  expect(() => createSection(badArgs)).toThrow();
});
