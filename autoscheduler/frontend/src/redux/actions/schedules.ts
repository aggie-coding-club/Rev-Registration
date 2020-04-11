import {
  AddScheduleAction, ADD_SCHEDULE, RemoveScheduleAction, REMOVE_SCHEDULE,
  ReplaceSchedulesAction, REPLACE_SCHEDULES,
} from '../reducers/schedules';
import Meeting from '../../types/Meeting';


export function addSchedule(meetings: Meeting[]): AddScheduleAction {
  return {
    type: ADD_SCHEDULE,
    meetings,
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
