import { combineReducers } from 'redux';

import { ADD_COURSE, CourseAction, REMOVE_COURSE } from './actionTypes';
import { Course } from '../types';

/**
 * Handles updates to the user's currently selected course list
 * @param state an array of courses that the user wants to take
 * @param action either an AddCourseAction or a RemoveCourseAction
 */
function courses(state: Array<Course> = [], action: CourseAction): Array<Course> {
  // This is a reducer. Reducers take in the old state and an action to apply to that state,
  // then return the new state after applying the action. This particular reducer is
  // designed to handle the course list. Generally, every independent piece of data in the
  // Redux store will have its own reducer.
  switch (action.type) {
    case ADD_COURSE:
      return [...state, action.course];
    case REMOVE_COURSE:
      return state.filter((course) => course !== action.course);
    default:
      return state;
  }
}

// this function combines the reducers for all pieces of the state
export const autoSchedulerApp = combineReducers({
  courses,
});
export type AppState = ReturnType<typeof autoSchedulerApp>;
export default autoSchedulerApp;
