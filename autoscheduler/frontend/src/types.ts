/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */

/**
 * This file is where we will declare the types of each data-holding class we will be using.
 */
export enum MeetingType {
  LEC, LAB, RES, INS, EXAM, SEM, PRAC, REC, CLD, CMP, PRL, CLAS, INT
}

export class Meeting {
  constructor(src: {
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
  }) {
    // run-time type checks
    if (!Number.isInteger(src.id)) { throw Error(`Meeting.id is invalid: +${src.id}`); }
    if (!Number.isInteger(src.crn)) { throw Error(`Meeting.crn is invalid: ${src.crn}`); }
    // impossible to type-check building: string | null
    if (!src.meetingDays || src.meetingDays.length !== 7) { throw Error(`Meeting.meetingDays is invalid: ${src.meetingDays}`); }
    if (!Number.isInteger(src.startTimeHours)
      || src.startTimeHours < 0 || src.startTimeHours > 23) {
      throw Error(`Meeting.startTimeHours is invalid: ${src.startTimeHours}`);
    }
    if (!Number.isInteger(src.startTimeMinutes)
      || src.startTimeMinutes < 0 || src.startTimeMinutes > 59) {
      throw Error(`Meeting.startTimeMinutes is invalid: ${src.startTimeMinutes}`);
    }
    if (!Number.isInteger(src.endTimeHours)
      || src.endTimeHours < 0 || src.endTimeHours > 23) {
      throw Error(`Meeting.endTimeHours is invalid: ${src.endTimeHours}`);
    }
    if (!Number.isInteger(src.endTimeMinutes)
      || src.endTimeMinutes < 0 || src.endTimeMinutes > 23) {
      throw Error(`Meeting.endTimeHours is invalid: ${src.endTimeMinutes}`);
    }

    // assuming all type-checks have passed,
    Object.assign(this, src);
  }
}

export class Section {
  constructor(src: {
    id: number;
    subject: string;
    courseNum: number;
    sectionNum: number;
    minCredits: number;
    maxCredits: number | null;
    currentEnrollment: number;
    instructor: Instructor;
  }) {
    if (!Number.isInteger(src.id)) { throw Error(`Section.id is invalid: ${src.id}`); }
    if (!src.subject) { throw Error(`Section.subject is invalid: ${src.subject}`); }
    if (!Number.isInteger(src.courseNum) || src.courseNum < 100 || src.courseNum > 1000) {
      throw Error(`Section.courseNum is invalid: ${src.courseNum}`);
    }
    if (!Number.isInteger(src.sectionNum) || src.sectionNum < 100 || src.sectionNum > 1000) {
      throw Error(`Section.sectionNum is invalid: ${src.sectionNum}`);
    }
    if (!Number.isInteger(src.minCredits)) {
      throw Error(`Section.minCredits is invalid: ${src.minCredits}`);
    }
    if (src.maxCredits !== null && !Number.isInteger(src.maxCredits)) {
      throw Error(`Section.maxCredits is invalid: ${src.maxCredits}`);
    }
    if (!Number.isInteger(src.currentEnrollment) || src.currentEnrollment < 0) {
      throw Error(`Section.currentEnrollment is invalid: ${src.currentEnrollment}`);
    }

    Object.assign(this, src);
  }
}

export class Course {
  constructor(src: {
    id: string;
    subject: string;
    courseNum: number;
    title: string;
    description: string | null;
    creditHours: number | null;
  }) {
    if (src.id == null) { throw Error(`Course.id is invalid: ${src.id}`); }
    if (src.subject == null) { throw Error(`Course.id is invalid: ${src.subject}`); }
    if (!Number.isInteger(src.courseNum)) {
      throw Error(`Course.courseNum is invalid: ${src.courseNum}`);
    }
    if (src.title == null) { throw Error(`Course.title is invalid: ${src.title}`); }
    // impossible to type-check description: string | null
    if (src.creditHours !== null && !Number.isInteger(src.creditHours)) {
      throw Error(`Course.creditHours is invalid: ${src.creditHours}`);
    }

    Object.assign(this, src);
  }
}

export class Department {
  constructor(src: {
    id: string;
    code: string;
    description: string;
  }) {
    if (!src.id) { throw Error(`Department.id is invalid: ${src.id}`); }
    if (!src.code) { throw Error(`Department.code is invalid: ${src.code}`); }
    if (!src.description) { throw Error(`Department.description is invalid: ${src.description}`); }

    Object.assign(this, src);
  }
}

export class Instructor {
  constructor(src: {
    id: number;
    name: string;
  }) {
    if (!Number.isInteger(src.id)) { throw Error(`Instructor.id is invalid: ${src.id}`); }
    if (!src.name) { throw Error(`Instructor.name is invalid: ${src.name}`); }

    Object.assign(this, src);
  }
}
