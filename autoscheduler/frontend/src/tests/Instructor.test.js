/* eslint-disable @typescript-eslint/no-var-requires */
const { Instructor } = require('../types');

const fetch = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
const createInstructor = jest.fn((args) => new Instructor(fetch(args)));
const correctArgs = {
  id: 123456,
  name: 'Aakash Tyagi',
};

test('Instructor accepts correct arguments', () => {
  // arrange is done above

  // act
  createInstructor(correctArgs);

  // assert
  expect(createInstructor).toReturn();
});

// test null values for all properties
const nonNullableProps = ['id', 'name'];
nonNullableProps.forEach((prop) => {
  test(`Instructor rejects null ${prop}`, () => {
    // arrange
    const badArgs = { ...correctArgs };
    badArgs[prop] = null;

    // act and assert
    expect(() => createInstructor(badArgs)).toThrow();
  });
});

// test incorrect types (can't test name because everything can be a JS string)
test('Instructor rejects string id', () => {
  // arrange
  const badArgs = {
    id: '123456',
    name: 'Aakash Tyagi',
  };

  // act and assert
  expect(() => createInstructor(badArgs)).toThrow();
});
