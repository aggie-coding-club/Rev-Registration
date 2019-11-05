/* eslint-disable import/prefer-default-export */

/**
 * This file is where we will declare the types of each data-holding class we will be using.
 */
export enum MeetingType {
  LEC, LAB, RES, INS
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
