import { SelectScheduleAction, SELECT_SCHEDULE } from '../reducers/selectedSchedule';

export default function selectSchedule(index: number): SelectScheduleAction {
  return {
    type: SELECT_SCHEDULE,
    index,
  };
}
