/**
 * This file is where we declare the string types and the TS interfaces
 * for each action type that can be dispatched to the store. Redux will use
 * the const strings in this file to determine which action to apply to the
 * old state in reducers.ts
 */
import Meeting from '../types/Meeting';
import { CourseCardOptions } from '../types/CourseCardOptions';

/* Meeting actions */
export const ADD_MEETING = 'ADD_MEETING';
export const REMOVE_MEETING = 'REMOVE_MEETING';
export const REPLACE_MEETINGS = 'REPLACE_MEETINGS';

export interface SingleMeetingAction {
    type: 'ADD_MEETING' | 'REMOVE_MEETING';
    meeting: Meeting;
}

export interface MultiMeetingAction {
    type: 'REPLACE_MEETINGS';
    meetings: Meeting[];
}

export type MeetingAction = SingleMeetingAction | MultiMeetingAction;

/* Course card actions */
export const ADD_COURSE_CARD = 'ADD_COURSE_CARD';
export const REMOVE_COURSE_CARD = 'REMOVE_COURSE_CARD';
export const UPDATE_COURSE_CARD = 'UPDATE_COURSE_CARD';

export interface AddCourseAction {
    type: 'ADD_COURSE_CARD';
    courseCard: CourseCardOptions;
}

export interface RemoveCourseAction {
    type: 'REMOVE_COURSE_CARD';
    index: number;
}

export interface UpdateCourseAction {
    type: 'UPDATE_COURSE_CARD';
    index: number;
    courseCard: CourseCardOptions;
}

export type CourseCardAction = AddCourseAction | RemoveCourseAction | UpdateCourseAction;
