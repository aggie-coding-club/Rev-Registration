import Section from './Section';

export enum MeetingType {
  LEC, LAB, RES, INS, EXAM, SEM, PRAC, REC, CLD, CMP, PRL, CLAS, INT
}

export const MeetingTypeDescription = new Map<MeetingType, string>([
  [MeetingType.LEC, 'Lecture'],
  [MeetingType.LAB, 'Laboratory'],
  [MeetingType.RES, 'Research'],
  [MeetingType.INS, 'Independent Study'],
  [MeetingType.EXAM, 'Examination'],
  [MeetingType.SEM, 'Seminar'],
  [MeetingType.PRAC, 'Practicum'],
  [MeetingType.REC, 'Recitation'],
  [MeetingType.CLD, 'Clinic'],
  [MeetingType.CMP, 'Competition'],
  [MeetingType.CLAS, 'Class'],
  [MeetingType.PRL, 'Private Lesson'],
  [MeetingType.INT, 'Internship'],
]);

export default class Meeting {
  id: number;
  building: string | null;
  meetingDays: boolean[];
  startTimeHours: number;
  startTimeMinutes: number;
  endTimeHours: number;
  endTimeMinutes: number;
  meetingType: MeetingType;
  section: Section;

  constructor(src: {
    id: number;
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
    if (!Number.isInteger(src.id)) { throw Error(`Meeting.id is invalid: ${src.id}`); }
    if (src.building === undefined) { throw Error(`Meeting.building is invalid: ${src.building}`); }
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
      || src.endTimeMinutes < 0 || src.endTimeMinutes > 60) {
      throw Error(`Meeting.endTimeMinutes is invalid: ${src.endTimeMinutes}`);
    }
    if (src.meetingType === null || src.meetingType === undefined) {
      throw Error(`Meeting.meetingType is invalid: ${src.meetingType}`);
    }
    if (!src.section) {
      throw Error(`Meeting.section is invalid: ${src.section}`);
    }

    // assuming all type-checks have passed,
    Object.assign(this, src);
  }
}
