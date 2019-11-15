export default class Course {
  id: string;
  subject: string;
  courseNum: number;
  title: string;
  description: string | null;
  creditHours: number | null;

  constructor(src: {
      id: string;
      subject: string;
      courseNum: number;
      title: string;
      description: string | null;
      creditHours: number | null;
    }) {
    if (src.id == null) { throw Error(`Course.id is invalid: ${src.id}`); }
    if (src.subject == null) { throw Error(`Course.subject is invalid: ${src.subject}`); }
    if (!Number.isInteger(src.courseNum)) {
      throw Error(`Course.courseNum is invalid: ${src.courseNum}`);
    }
    if (src.title == null) { throw Error(`Course.title is invalid: ${src.title}`); }
    if (src.description === undefined) {
      throw Error(`Course.description is invalid: ${src.description}`);
    }
    if (src.creditHours !== null && !Number.isInteger(src.creditHours)) {
      throw Error(`Course.creditHours is invalid: ${src.creditHours}`);
    }

    Object.assign(this, src);
  }
}
