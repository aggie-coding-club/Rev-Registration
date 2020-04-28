import Instructor from './Instructor';
import Grades from './Grades';

export default class Section {
  id: number;
  crn: number;
  subject: string;
  courseNum: string;
  sectionNum: string;
  minCredits: number;
  maxCredits: number | null;
  currentEnrollment: number;
  maxEnrollment: number;
  instructor: Instructor;
  grades: Grades;

  constructor(src: {
      id: number;
      crn: number;
      subject: string;
      courseNum: string;
      sectionNum: string;
      minCredits: number;
      maxCredits: number | null;
      currentEnrollment: number;
      maxEnrollment: number;
      instructor: Instructor;
      grades: Grades;
    }) {
    if (!Number.isInteger(src.id)) { throw Error(`Section.id is invalid: ${src.id}`); }
    if (!Number.isInteger(src.crn)) { throw Error(`Meeting.crn is invalid: ${src.crn}`); }
    if (!src.subject) { throw Error(`Section.subject is invalid: ${src.subject}`); }
    if (!src.courseNum) { throw Error(`Section.courseNum is invalid ${src.courseNum}`); }
    if (!src.sectionNum) { throw Error(`Section.sectionNUm is invalid: ${src.sectionNum}`); }
    if (!Number.isInteger(src.minCredits)) {
      throw Error(`Section.minCredits is invalid: ${src.minCredits}`);
    }
    if (src.maxCredits !== null && !Number.isInteger(src.maxCredits)) {
      throw Error(`Section.maxCredits is invalid: ${src.maxCredits}`);
    }
    if (!Number.isInteger(src.currentEnrollment) || src.currentEnrollment < 0) {
      throw Error(`Section.currentEnrollment is invalid: ${src.currentEnrollment}`);
    }
    if (!Number.isInteger(src.maxEnrollment) || src.maxEnrollment < 0) {
      throw Error(`Section.maxEnrollment is invalid: ${src.maxEnrollment}`);
    }
    if (!src.instructor) { throw Error(`Section.instructor is invalid: ${src.instructor}`); }

    Object.assign(this, src);
  }
}
