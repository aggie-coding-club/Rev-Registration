/* eslint-disable import/prefer-default-export */
import Section from './Section';
import Meeting from './Meeting';

export enum CustomizationLevel {
  BASIC, SECTION
}

export interface SectionSelected {
  section: Section;
  meetings: Meeting[];
  selected: boolean;
}

export interface CourseCardOptions {
  course?: string;
  customizationLevel?: CustomizationLevel;
  web?: boolean;
  honors?: boolean;
  sections?: SectionSelected[];
}

export interface CourseCardArray {
  [index: number]: CourseCardOptions;
  numCardsCreated: number;
}
