
export const SELECT_SCHEDULE = 'SELECT_SCHEDULE';

export interface SelectScheduleAction {
    type: 'SELECT_SCHEDULE';
    index: number;
}

export default function selectedSchedule(
  state: number = null, action: SelectScheduleAction,
): number {
  switch (action.type) {
    case SELECT_SCHEDULE:
      return action.index;
    default:
      return state;
  }
}
