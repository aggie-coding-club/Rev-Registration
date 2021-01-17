/* These all have to be in the same file due to dependency cycles
*/

import Availability, { AvailabilityArgs } from '../../types/Availability';
import { CourseCardOptions } from '../../types/CourseCardOptions';
import Meeting from '../../types/Meeting';
import Schedule from '../../types/Schedule';
import { RemoveSelectedAvailabilityAction } from '../reducers/selectedAvailability';

/*
  TERM
*/
export interface SetTermAction {
  type: 'SET_TERM';
  term: string;
}

/*
  AVAILABILITIES
*/
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
    numNewAvs: number;
}
export interface SetAvailabilitiesAction {
  type: 'SET_AVAILABILITIES';
  availabilities: Availability[];
  term: string;
}
export interface ClearAvailabilitiesAction {
  type: 'CLEAR_AVAILABILITIES';
}
export type AvailabilityAction =
    AddAvailabilityAction | DeleteAvailabilityAction | UpdateAvailabilityAction |
    MergeAvailabilityAction | SetAvailabilitiesAction | RemoveSelectedAvailabilityAction |
    ClearAvailabilitiesAction;

/*
    SCHEDULES
*/
export interface AddScheduleAction {
    type: 'ADD_SCHEDULE';
    meetings: Meeting[];
}
export interface RemoveScheduleAction {
    type: 'REMOVE_SCHEDULE';
    index: number;
}
export interface ReplaceSchedulesAction {
    type: 'REPLACE_SCHEDULES';
    schedules: Meeting[][];
}
export interface SaveScheduleAction {
    type: 'SAVE_SCHEDULE';
    index: number;
}
export interface UnsaveScheduleAction {
    type: 'UNSAVE_SCHEDULE';
    index: number;
}
export interface RenameScheduleAction {
  type: 'RENAME_SCHEDULE';
  index: number;
  name: string;
}
export interface SetSchedulesAction {
  type: 'SET_SCHEDULES';
  schedules: Schedule[];
  term: string;
}
export interface ClearSchedulesAction {
  type: 'CLEAR_SCHEDULES';
}
export type ScheduleAction = AddScheduleAction | RemoveScheduleAction | ReplaceSchedulesAction
| SaveScheduleAction | UnsaveScheduleAction | RenameScheduleAction | SetSchedulesAction
| ClearSchedulesAction;

/*
  COURSE CARDS
*/

export interface AddCourseAction {
    type: 'ADD_COURSE_CARD';
    courseCard: CourseCardOptions;
    idx?: number;
    term: string;
}
export interface RemoveCourseAction {
    type: 'REMOVE_COURSE_CARD';
    index: number;
}
export interface UpdateCourseAction {
    type: 'UPDATE_COURSE_CARD';
    index: number;
    courseCard: CourseCardOptions;
    term: string;
}
export interface ClearCourseCardsAction {
  type: 'CLEAR_COURSE_CARDS';
}
export type CourseCardAction = AddCourseAction | RemoveCourseAction | UpdateCourseAction
| ClearCourseCardsAction | SetTermAction;

export type TermDataAction = SetTermAction | ScheduleAction | AvailabilityAction | CourseCardAction;
