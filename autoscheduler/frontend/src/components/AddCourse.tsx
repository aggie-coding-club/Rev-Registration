import * as React from 'react';
import { connect } from 'react-redux';
import { addCourse } from '../redux/actions';
import { AddCourseAction } from '../redux/actionTypes';

const dispatchProps = {
  dispatchAddCourse: addCourse,
};

const AddCourse = ({ dispatchAddCourse }: typeof dispatchProps): JSX.Element => (
  <button onClick={(): AddCourseAction => dispatchAddCourse({ department: 'CSCE', courseNumber: 221 })} type="submit">Add Course</button>
);

export default connect(null, dispatchProps)(AddCourse);
