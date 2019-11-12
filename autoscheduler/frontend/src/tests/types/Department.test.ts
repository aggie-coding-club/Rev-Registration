import Department from '../../types/Department';
import { Indexable, fetchMock } from '../util';

// arrange
const correctArgs: Indexable = {
  id: 'deadbeef',
  code: 'DEPT',
  description: 'Hassan Department of Computer Science',
};
const createDepartment = jest.fn((args) => new Department(fetchMock(args)));

test('Department accepts correct arguments', () => {
  // act
  createDepartment(correctArgs);

  // assert
  expect(createDepartment).toReturn();
});

const nonNullableProps = ['id', 'code', 'description'];
test.each(nonNullableProps)('Department rejects null %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = null;

  // act and assert
  expect(() => createDepartment(badArgs)).toThrow();
});

test.each(Object.keys(correctArgs))('Department rejects undefined %s', (prop) => {
  // arrange
  const badArgs = { ...correctArgs };
  badArgs[prop] = undefined;

  // act and assert
  expect(() => createDepartment(badArgs)).toThrow();
});
