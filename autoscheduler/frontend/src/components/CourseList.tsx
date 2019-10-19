/* eslint-disable react/prefer-stateless-function */
import * as React from 'react';
import { connect } from 'react-redux';
import { Course } from '../types';
import { StateShape } from '../redux/actionTypes';

interface CourseListProps {
    courses: Array<Course>;
}

const mapStateToProps = (state: StateShape /* , ownProps */): StateShape => ({
  courses: state.courses,
});

class CourseList extends React.Component<CourseListProps> {
  render(): JSX.Element {
    const { courses } = this.props;
    return (
      <p>
        {courses ? courses.length : 0}
        {' '}
        courses
      </p>
    );
  }
}

export default connect(mapStateToProps)(CourseList);
