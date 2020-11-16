/**
 * Stores multiple arrays of meetings, where each array represents one possible
 * schedule that the user can choose from
 */
import Meeting from '../../types/Meeting';
import Schedule from '../../types/Schedule';

// action type strings
export const ADD_SCHEDULE = 'ADD_SCHEDULE';
export const REMOVE_SCHEDULE = 'REMOVE_SCHEDULE';
export const REPLACE_SCHEDULES = 'REPLACE_SCHEDULES';
export const SAVE_SCHEDULE = 'SAVE_SCHEDULE';
export const UNSAVE_SCHEDULE = 'UNSAVE_SCHEDULE';
export const RENAME_SCHEDULE = 'RENAME_SCHEDULE';
export const SET_SCHEDULES = 'SET_SCHEDULES';

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
}
export type ScheduleAction = AddScheduleAction | RemoveScheduleAction | ReplaceSchedulesAction
| SaveScheduleAction | UnsaveScheduleAction | RenameScheduleAction | SetSchedulesAction;

const initialSchedules: Schedule[] = [];

// Helper function to create an unused name for a schedule
const getUniqueName = (
  existingSchedules: Schedule[],
  preferredName: string = undefined,
  index: number = undefined,
): string => {
  const existingNames = new Set(existingSchedules.map((schedule) => schedule.name));
  // If this schedule already exists, disregard it when checking existing names
  if (index !== undefined) existingNames.delete(existingSchedules[index].name);

  // Trim whitespace from preferred name
  const baseName = preferredName?.trim();
  let name = baseName || 'Schedule 1';

  // Default names start counting from 1, if a name is preferred the first copy is called name (1)
  let number = preferredName ? 0 : 1;

  while (existingNames.has(name)) {
    number += 1;
    name = baseName ? `${baseName} (${number})` : `Schedule ${number}`;
  }

  return name;
};

// Helper function to create a new function with the default name (Schedule x),
// where x is the lowest number schedule not already taken
const createSchedule = (meetings: Meeting[], existingSchedules: Schedule[]): Schedule => ({
  meetings,
  name: getUniqueName(existingSchedules),
  saved: false,
});

// returns whether a list of schedules contains a schedule with the same meetings as schedule
export function containsSchedule(allSchedules: Schedule[], schedule: Meeting[]): boolean {
  const scheduleMeetings = new Set(schedule.map((meeting) => meeting.id));
  return allSchedules.some((toCompare) => {
    const toCompareMeetings = new Set(toCompare.meetings.map((meeting) => meeting.id));
    return scheduleMeetings.size === toCompareMeetings.size
      && [...scheduleMeetings].every((meeting) => toCompareMeetings.has(meeting));
  });
}

function getUniqueSchedules(allSchedules: Schedule[]): Schedule[] {
  const unique: Schedule[] = [];
  allSchedules.forEach((schedule) => {
    if (!containsSchedule(unique, schedule.meetings)) unique.push(schedule);
  });
  return unique;
}

// reducer
function schedules(state: Schedule[] = initialSchedules, action: ScheduleAction): Schedule[] {
  switch (action.type) {
    case ADD_SCHEDULE: {
      return [...state, createSchedule(action.meetings, state)];
    }
    case REMOVE_SCHEDULE: {
      const newState = [...state];
      newState.splice(action.index, 1);
      return newState;
    }
    case REPLACE_SCHEDULES: {
      // Copy each saved schedule
      const newState: Schedule[] = state.filter((schedule) => schedule.saved);

      // Add all new schedules
      action.schedules.forEach((meetings) => {
        newState.push(createSchedule(meetings, newState));
      });

      return getUniqueSchedules(newState);
    }
    case SAVE_SCHEDULE: {
      const newState = [...state];
      newState[action.index] = { ...newState[action.index], saved: true };
      return newState;
    }
    case UNSAVE_SCHEDULE: {
      const newState = [...state];
      newState[action.index] = { ...newState[action.index], saved: false };
      return newState;
    }
    case RENAME_SCHEDULE: {
      const newState = [...state];
      newState[action.index] = {
        ...newState[action.index],
        name: getUniqueName(newState, action.name, action.index),
      };
      return newState;
    }
    case SET_SCHEDULES:
      return action.schedules;
    default:
      return state;
  }
}

export default schedules;
