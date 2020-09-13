import {
  AddScheduleAction, ADD_SCHEDULE, RemoveScheduleAction, REMOVE_SCHEDULE,
  ReplaceSchedulesAction, REPLACE_SCHEDULES, SaveScheduleAction, SAVE_SCHEDULE,
  UnsaveScheduleAction, UNSAVE_SCHEDULE,
} from '../reducers/schedules';
import Meeting from '../../types/Meeting';

export function addSchedule(schedule: Meeting[]): AddScheduleAction {
  return {
    type: ADD_SCHEDULE,
    schedule,
  };
}

export function removeSchedule(index: number): RemoveScheduleAction {
  return {
    type: REMOVE_SCHEDULE,
    index,
  };
}

export function replaceSchedules(schedules: Meeting[][]): ReplaceSchedulesAction {
  return {
    type: REPLACE_SCHEDULES,
    schedules,
  };
}

export function saveSchedule(index: number): SaveScheduleAction {
  return {
    type: SAVE_SCHEDULE,
    index,
  };
}

export function unsaveSchedule(index: number): UnsaveScheduleAction {
  return {
    type: UNSAVE_SCHEDULE,
    index,
  };
}
