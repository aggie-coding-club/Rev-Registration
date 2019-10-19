/* eslint-disable react/prefer-stateless-function */
import * as React from 'react';
import { connect } from 'react-redux';
import { Course } from '../types';
import { AppState } from '../redux/reducers';

interface CourseListProps {
    courses: Array<Course>;
}

const mapStateToProps = (state: AppState /* , ownProps */): AppState => ({
  courses: state.courses,
});

/**
 * Returns a JSX Element that represents the given course
 * @param course A Course object representing the data to be displayed
 */
function renderCourse(course: Course): JSX.Element {
  return (
    <p>{`${course.department} ${course.courseNumber}`}</p>
  );
}

/**
 * Displays the user's list of currently selected classes
 */
class CourseList extends React.Component<CourseListProps> {
  render(): JSX.Element {
    // INFO this is destructuring props. Basically, JS will look for a property named
    // this.props.courses, and if it finds it, it will set the local variable courses equal
    // to this.props.courses (by value ofc). It's just a little JS shorthand to save some
    // keystrokes
    const { courses } = this.props;

    // INFO apparently Airbnb prefers currying over loops
    /* const coursesList: Array<JSX.Element> = [];
    for (const course of courses) {
      coursesList.push(this.renderCourse(course));
    } */

    return (
      <div>
        {/* INFO in React, every component needs to have a single root element, usually a div */}
        {courses.map((course) => renderCourse(course))}
        {/* INFO line above pastes the JSX Elements stored in coursesList, one after another */}
      </div>
    );
  }
}

export default connect(mapStateToProps)(CourseList);
