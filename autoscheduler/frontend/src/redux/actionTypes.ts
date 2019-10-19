import { Course } from '../types';

export const ADD_COURSE = 'ADD_COURSE';
export const REMOVE_COURSE = 'REMOVE_COURSE';

/**
 * Adds a course to the user's list of currently selected courses
 */
export interface AddCourseAction {
    type: typeof ADD_COURSE;
    course: Course;
}

/**
 * Removes a course from the user's list of currently selected courses
 */
export interface RemoveCourseAction {
    type: typeof REMOVE_COURSE;
    course: Course;
}

/**
 * Any action that changes the user's list of currently selected courses
 */
export type CourseAction = AddCourseAction | RemoveCourseAction;
