export default class Department {
  id: string;

  code: string;

  description: string;

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
