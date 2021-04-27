import DayOfWeek from '../types/DayOfWeek';
import Meeting from '../types/Meeting';
import { filterDuplicateMeetings } from './meetingsForSection';

/**
 *  Gets all of the meetings for this specific day from the schedule
 * @param day The day we want the meetings for
 * @param schedule The schedule we're getting the Meetings from
 * @returns Meetings for that day
 */
function getMeetingsForDay(day: number, schedule: Meeting[]): Meeting[] {
  // meetingDays = UMTWRFS
  // day = MTWRF
  return schedule.filter((meeting) => meeting.meetingDays[day]);
}

/**
 * Returns the unique meetings for a schedule, partioned by day of the week
 * @param schedule The schedule to partion
 * @returns 2D list of meetings to process
 */
export default function meetingsForSchedule(schedule: Meeting[]): Meeting[][] {
  return [DayOfWeek.MON, DayOfWeek.TUE, DayOfWeek.WED, DayOfWeek.THU, DayOfWeek.FRI].map(
    (idx) => filterDuplicateMeetings(getMeetingsForDay(idx, schedule)),
  );
}
