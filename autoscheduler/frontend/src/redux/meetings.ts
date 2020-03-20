/**
 * Stores multiple meeting times for the classes in the currently displayed schedule
 */
import Meeting from '../types/Meeting';

// action type strings
export const ADD_MEETING = 'ADD_MEETING';
export const REMOVE_MEETING = 'REMOVE_MEETING';
export const REPLACE_MEETINGS = 'REPLACE_MEETINGS';

// action type interfaces
export interface SingleMeetingAction {
    type: 'ADD_MEETING' | 'REMOVE_MEETING';
    meeting: Meeting;
}
export interface MultiMeetingAction {
    type: 'REPLACE_MEETINGS';
    meetings: Meeting[];
}
export type MeetingAction = SingleMeetingAction | MultiMeetingAction;

// reducer
export default function meetings(state: Meeting[] = [], action: MeetingAction): Meeting[] {
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
