import { combineReducers } from 'redux';

import { AddCourseAction, ADD_COURSE } from './actionTypes';
import { Course } from '../types';

function courses(state: Array<Course> = [], action: AddCourseAction): Array<Course> {
  switch (action.type) {
    case ADD_COURSE:
      return [...state, action.course];
    default:
      return state;
  }
}

const autoSchedulerApp = combineReducers(
  courses,
);
export default autoSchedulerApp;
