/* eslint-disable import/prefer-default-export */
import Section from './Section';
import Meeting from './Meeting';

export enum CustomizationLevel {
  BASIC, SECTION
}

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
  web?: string;
  honors?: string;
  sections?: SectionSelected[];
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
