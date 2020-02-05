export default class Instructor {
  name: string;

  constructor(src: {
      name: string;
    }) {
    if (!src.name) { throw Error(`Instructor.name is invalid: ${src.name}`); }

    Object.assign(this, src);
  }
}
