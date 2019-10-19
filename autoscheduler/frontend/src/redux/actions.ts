import { Course } from '../types';
import {
  AddCourseAction, ADD_COURSE, RemoveCourseAction, REMOVE_COURSE,
} from './actionTypes';

export const addCourse = (course: Course): AddCourseAction => ({
  type: ADD_COURSE,
  course,
});

export const removeCourse = (course: Course): RemoveCourseAction => ({
  type: REMOVE_COURSE,
  course,
});
