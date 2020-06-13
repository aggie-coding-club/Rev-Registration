/**
 * Stores multiple arrays of meetings, where each array represents one possible
 * schedule that the user can choose from
 */
import Meeting from '../../types/Meeting';

// action type strings
export const ADD_SCHEDULE = 'ADD_SCHEDULE';
export const REMOVE_SCHEDULE = 'REMOVE_SCHEDULE';
export const REPLACE_SCHEDULES = 'REPLACE_SCHEDULES';
export const SAVE_SCHEDULE = 'SAVE_SCHEDULE';
export const UNSAVE_SCHEDULE = 'UNSAVE_SCHEDULE';

// action type interfaces
export interface AddScheduleAction {
    type: 'ADD_SCHEDULE';
    schedule: Meeting[];
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
export type ScheduleAction = AddScheduleAction | RemoveScheduleAction
  | ReplaceSchedulesAction | SaveScheduleAction | UnsaveScheduleAction;

interface Schedules {
  schedules: Meeting[][];
  savedSchedules: Meeting[][];
}

const initialSchedules: Schedules = {
  schedules: [],
  savedSchedules: [],
};

// returns whether a list of schedules contains a schedule with the same meetings as schedule
export function containsSchedule(schedules: Meeting[][], schedule: Meeting[]): boolean {
  const scheduleMeetings = new Set(schedule.map((meeting) => meeting.id));
  return schedules.some((toCompare) => {
    const toCompareMeetings = new Set(toCompare.map((meeting) => meeting.id));
    return scheduleMeetings.size === toCompareMeetings.size
      && [...scheduleMeetings].every((meeting) => toCompareMeetings.has(meeting));
  });
}

function getUniqueSchedules(...schedules: Meeting[][]): Meeting[][] {
  const unique: Meeting[][] = [];
  schedules.forEach((schedule) => {
    if (!containsSchedule(unique, schedule)) unique.push(schedule);
  });
  return unique;
}

// reducer
function meetings(state: Schedules = initialSchedules, action: ScheduleAction): Schedules {
  switch (action.type) {
    case ADD_SCHEDULE:
      return { ...state, schedules: [...state.schedules, action.schedule] };
    case REMOVE_SCHEDULE:
      return {
        ...state,
        schedules: state.schedules.slice(0, action.index)
          .concat(state.schedules.slice(action.index + 1)),
      };
    case REPLACE_SCHEDULES:
      return {
        ...state,
        schedules: getUniqueSchedules(...state.savedSchedules, ...action.schedules),
      };
    case SAVE_SCHEDULE:
      return {
        ...state,
        savedSchedules: state.savedSchedules
          .concat(containsSchedule(state.savedSchedules, state.schedules[action.index])
            ? [] : [state.schedules[action.index]]),
      };
    case UNSAVE_SCHEDULE:
      return {
        ...state,
        savedSchedules: state.savedSchedules.filter((schedule) => (
          schedule !== state.schedules[action.index])),
      };
    default:
      return state;
  }
}

export default meetings;
