/**
 * This file declares functions that take in the payload for an action and
 * return the action in the form that the Redux reducers need, with a string
 * type.
 */
import Meeting from '../types/Meeting';
import {
  ADD_MEETING, REMOVE_MEETING, REPLACE_MEETINGS, SingleMeetingAction, MultiMeetingAction,
} from './actionTypes';

export function addMeeting(meeting: Meeting): SingleMeetingAction {
  return {
    type: ADD_MEETING,
    meeting,
  };
}

export function removeMeeting(meeting: Meeting): SingleMeetingAction {
  return {
    type: REMOVE_MEETING,
    meeting,
  };
}

export function replaceMeetings(meetings: Meeting[]): MultiMeetingAction {
  return {
    type: REPLACE_MEETINGS,
    meetings,
  };
}
