interface GradesInit {
    gpa: number;
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
    I: number;
    S: number;
    Q: number;
    X: number;
}

export default class Grades {
  gpa: number;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  I: number;
  S: number;
  Q: number;
  X: number;
  constructor(init: GradesInit) {
    Object.assign(this, init);
  }
}
