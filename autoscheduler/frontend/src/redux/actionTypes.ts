/**
 * This file is where we declare the string types and the TS interfaces
 * for each action type that can be dispatched to the store. Redux will use
 * the const strings in this file to determine which action to apply to the
 * old state in reducers.ts
 */
import Meeting from '../types/Meeting';
import { CourseCardOptions } from '../types/CourseCardOptions';
import { AvailabilityType, AvailabilityArgs } from '../types/Availability';

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

/* Availability actions */
export const SET_AVAILABILITY_MODE = 'SET_AVAILABILITY_MODE';
export const ADD_AVAILABILITY = 'ADD_AVAILABILITY';
export const DELETE_AVAILABILITY = 'DELETE_AVAILABILITY';
export const UPDATE_AVAILABILITY = 'UPDATE_AVAILABILITY';
export const MERGE_AVAILABILITY = 'MERGE_AVAILABILITY';

export interface AvailabilityModeAction {
    type: 'SET_AVAILABILITY_MODE';
    mode: AvailabilityType;
}

export interface AddAvailabilityAction {
    type: 'ADD_AVAILABILITY';
    availability: AvailabilityArgs;
}

export interface DeleteAvailabilityAction {
    type: 'DELETE_AVAILABILITY';
    availability: AvailabilityArgs;
}

export interface UpdateAvailabilityAction {
    type: 'UPDATE_AVAILABILITY';
    availability: AvailabilityArgs;
}

export interface MergeAvailabilityAction {
    type: 'MERGE_AVAILABILITY';
}

export type AvailabilityAction =
    AddAvailabilityAction | DeleteAvailabilityAction |
    UpdateAvailabilityAction | MergeAvailabilityAction;

/* Availability To Update actions */
export const SET_SELECTED_AVAILABILITY = 'SET_SELECTED_AVAILABILITY';

export interface SetSelectedAvailabilityAction {
    type: 'SET_SELECTED_AVAILABILITY';
    availability: AvailabilityArgs;
}

export interface UpdateAvailabilityAction {
    type: 'UPDATE_AVAILABILITY';
    availability: Availability;
    newValues: Availability;
}

export type AvailabilityAction = AddAvailabilityAction | UpdateAvailabilityAction;
