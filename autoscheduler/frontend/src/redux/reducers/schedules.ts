/**
 * Stores multiple arrays of meetings, where each array represents one possible
 * schedule that the user can choose from
 */
import Meeting from '../../types/Meeting';

// action type strings
export const ADD_SCHEDULE = 'ADD_SCHEDULE';
export const REMOVE_SCHEDULE = 'REMOVE_SCHEDULE';
export const REPLACE_SCHEDULES = 'REPLACE_SCHEDULES';

// action type interfaces
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
export type ScheduleAction = AddScheduleAction | RemoveScheduleAction | ReplaceSchedulesAction;

// reducer
export default function meetings(state: Meeting[][] = [], action: ScheduleAction): Meeting[][] {
  switch (action.type) {
    case ADD_SCHEDULE:
      return [...state, action.meetings];
    case REMOVE_SCHEDULE:
      return state.slice(0, action.index).concat(state.slice(action.index + 1));
    case REPLACE_SCHEDULES:
      return action.schedules;
    default:
      return state;
  }
}
