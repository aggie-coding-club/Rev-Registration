import Instructor from '../types/Instructor';
import Section from '../types/Section';

/* eslint-disable import/prefer-default-export */

/**
 * Allows us to set arbitrary arguments of arguments for easier
 * test-writing
 */
export interface Indexable {
  [key: string]: number | string | boolean[] | Instructor | Section | boolean;
}

/**
 * Mocks the uncertain types returned by HttpResponse.json()
 */
export const fetchMock = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
