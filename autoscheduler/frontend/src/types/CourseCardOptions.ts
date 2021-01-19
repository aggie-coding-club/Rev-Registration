/* eslint-disable import/prefer-default-export */
import Section from './Section';
import Meeting from './Meeting';

export enum CustomizationLevel {
  BASIC, SECTION
}

export enum SectionFilter {
  NO_PREFERENCE = 'no_preference',
  EXCLUDE = 'exclude',
  ONLY = 'only',
}

/** DEFAULT:
 *    Groups sections by professor and honors status, then sorts each group by the lowest section
 *    number in the group, with TBA sections getting sorted to the bottom.
 */
export enum SortType {
  DEFAULT, SECTION_NUM, GRADE, INSTRUCTOR, OPEN_SEATS, HONORS, INSTRUCTIONAL_METHOD,
}
// frontend display labels to make it easier to manage
export const SortTypeLabels = new Map<SortType, string>([
  [SortType.DEFAULT, 'Default'],
  [SortType.SECTION_NUM, 'Section Num'],
  [SortType.GRADE, 'Grade'],
  [SortType.INSTRUCTOR, 'Instructor'],
  [SortType.OPEN_SEATS, 'Open Seats'],
  [SortType.HONORS, 'Honors'],
  [SortType.INSTRUCTIONAL_METHOD, 'Instructional Method'],
]);
// so that we can reset to defaults on sort type change
export const SortTypeDefaultIsDescending = new Map<SortType, boolean>([
  [SortType.DEFAULT, true],
  [SortType.SECTION_NUM, false],
  [SortType.GRADE, true],
  [SortType.INSTRUCTOR, false],
  [SortType.OPEN_SEATS, true],
  [SortType.HONORS, true],
  [SortType.INSTRUCTIONAL_METHOD, true],
]);

/**
 * Represents a section, its meetings, and whether or not the section
 * is curently selected
 */
export interface SectionSelected {
  section: Section;
  meetings: Meeting[];
  selected: boolean;
}

export interface CourseCardOptions {
  course?: string;
  customizationLevel?: CustomizationLevel;
  remote?: string;
  honors?: string;
  asynchronous?: string;
  hasHonors?: boolean;
  hasRemote? : boolean;
  hasAsynchronous?: boolean;
  sections?: SectionSelected[];
  loading?: boolean;
  collapsed?: boolean;
  sortType?: SortType;
  sortIsDescending?: boolean;
}

// Represents a course card when saved and serialized, sections are saved as strings
// to save space
export interface SerializedCourseCardOptions {
  course?: string;
  customizationLevel?: CustomizationLevel;
  remote?: string;
  honors?: string;
  asynchronous?: string;
  sections?: number[];
  collapsed?: boolean;
  sortType?: SortType;
  sortIsDescending?: boolean;
}

/**
 * Represents all course cards currently in existence
 */
export interface CourseCardArray {
  [index: number]: CourseCardOptions;
  /**
   * The number of cards created at this point in time is 1 more than the largest
   * possible index for any card in the array. numCardsCreated should NOT be used
   * to determine the number of cards currently in existence, as removing cards does
   * not decrement numCardsCreated
   */
  numCardsCreated: number;
}
