export default class Instructor {
  id: number;

  name: string;

  constructor(src: {
      id: number;
      name: string;
    }) {
    if (!Number.isInteger(src.id)) { throw Error(`Instructor.id is invalid: ${src.id}`); }
    if (!src.name) { throw Error(`Instructor.name is invalid: ${src.name}`); }

    Object.assign(this, src);
  }
}
