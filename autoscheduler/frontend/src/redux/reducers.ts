/**
 * Reducers in Redux are functions that take in the old state and an action
 * to apply to that state, then return the new state. All reducers go in this file.
 */
import { combineReducers } from 'redux';
import {
  MeetingAction, ADD_MEETING, REMOVE_MEETING, REPLACE_MEETINGS,
} from './actionTypes';
import Meeting from '../types/Meeting';

// manage actions that affect meetings
function meetings(state: Meeting[] = [], action: MeetingAction): Meeting[] {
  switch (action.type) {
    case ADD_MEETING:
      return [...state, action.meeting];
    case REMOVE_MEETING:
      return state.filter((mtg: Meeting) => mtg.id !== action.meeting.id);
    case REPLACE_MEETINGS:
      return action.meetings;
    default:
      return state;
  }
}

// return combined reducer for entire app
const autoSchedulerReducer = combineReducers({
  meetings,
});

export default autoSchedulerReducer;
