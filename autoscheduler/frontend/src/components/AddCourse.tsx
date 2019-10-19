import * as React from 'react';
import { connect } from 'react-redux';
import { addCourse } from '../redux/actions';
import { AddCourseAction } from '../redux/actionTypes';

const dispatchProps = {
  dispatchAddCourse: addCourse,
};
type AddCourseProps = typeof dispatchProps;


/**
 * A wrapper for a button that adds a course to the user's list of selected courses.
 */
// eslint-disable-next-line max-len
const AddCourse: React.FC<AddCourseProps> = ({ dispatchAddCourse }: AddCourseProps): JSX.Element => (
  // INFO: this component is written as a functional component. Functional components are one
  // way to design UI Elements in React, particularly when there is no state to manage. The function
  // takes in some props, then returns a JSX (basically HTML++) element. This particular function
  // also uses destructuring props, and I explain that in CourseList.tsx
  <button
    onClick={(): AddCourseAction => dispatchAddCourse({ department: 'CSCE', courseNumber: 221 })}
    type="submit" // INFO notice that I can write normal JS inside the {} in the line above
  >
    Add Course
  </button>
);

export default connect(null, dispatchProps)(AddCourse);
