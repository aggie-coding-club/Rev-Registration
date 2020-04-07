import Meeting from '../../types/Meeting'; import {
  SingleMeetingAction, ADD_MEETING, REMOVE_MEETING, MultiMeetingAction, REPLACE_MEETINGS,
} from '../reducers/meetings';

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

/**
   * Overwrites the existing meetings with the provided ones. Use this
   * action when the user switches between potential schedules.
   * @param meetings new list of meetings to show in schedule/calendar
   */
export function replaceMeetings(meetings: Meeting[]): MultiMeetingAction {
  return {
    type: REPLACE_MEETINGS,
    meetings,
  };
}
