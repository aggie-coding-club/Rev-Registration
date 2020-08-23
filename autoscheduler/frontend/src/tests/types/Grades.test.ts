import Grades from '../../types/Grades';
import { Indexable, fetchMock } from '../util';

const correctArgs: Indexable = {
  gpa: 0.0, A: 0, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, U: 0, Q: 0, X: 0, count: 0,
};

const createGrades = jest.fn((args) => new Grades(fetchMock(args)));

describe('Grades type', () => {
  describe('throws an error', () => {
    const nonNullableProps = ['gpa', 'A', 'B', 'C', 'D', 'F', 'I', 'S', 'U', 'Q', 'X'];
    test.each(nonNullableProps)('when any of the properties are null %s', (prop) => {
      // arrange
      const badArgs = { ...correctArgs };
      badArgs[prop] = null;

      // act/assert
      expect(() => createGrades(badArgs)).toThrow();
    });
  });

  describe('does not throw an error', () => {
    test('when all of the props are not-null', () => {
      // arrange/act/assert
      expect(() => createGrades(correctArgs)).not.toThrow();
    });
  });
});
