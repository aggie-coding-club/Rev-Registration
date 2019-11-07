import Instructor from './Instructor';

export default class Section {
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
    if (!src.instructor) { throw Error(`Section.instructor is invalid: ${src.instructor}`); }

    Object.assign(this, src);
  }
}
