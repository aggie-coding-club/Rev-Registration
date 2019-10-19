import { Course } from '../types';

export const ADD_COURSE = 'ADD_COURSE';
export const REMOVE_COURSE = 'REMOVE_COURSE';

export interface AddCourseAction {
    type: typeof ADD_COURSE;
    course: Course;
}

export interface RemoveCourseAction {
    type: typeof REMOVE_COURSE;
    course: Course;
}

export interface StateShape {
    courses: Array<Course>;
}
