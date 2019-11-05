/* eslint-disable import/prefer-default-export */

/**
 * This file is where we will declare the types of each data-holding class we will be using.
 */
export enum MeetingType {
  LEC, LAB, RES, INS, EXAM, SEM, PRAC, REC, CLD, CMP, PRL, CLAS, INT
}

export interface Meeting {
  id: number;
  crn: number;
  building: string | null;
  meetingDays: boolean[];
  startTimeHours: number;
  startTimeMinutes: number;
  endTimeHours: number;
  endTimeMinutes: number;
  meetingType: MeetingType;
  section: Section;
}

export interface Section {
  id: number;
  subject: string;
  courseNum: number;
  sectionNum: number;
  minCredits: number;
  maxCredits: number | null;
  currentEnrollment: number;
  instructor: number;
}

export interface Course {
  id: string;
  subject: string;
  courseNum: number;
  title: string;
  description: string | null;
  creditHours: number | null;
}

export interface Department {
  id: string;
  code: string;
  description: string;
}
