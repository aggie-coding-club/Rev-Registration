import Meeting from '../types/Meeting';

export const FIRST_HOUR = 7;
export const LAST_HOUR = 23;
/**
 * Given the hours and minutes of a time, returns a formatted string representation of
 * that time. By default, this uses 12-hour format, but an extra argument can be specified
 * to use 24-hour format
 * @param h hours
 * @param m minutes
 * @param use24Hour if true, applies 24-hour format instead of the default 12-hour format
 */
export function formatTime(h: number, m: number, use24Hour = false, padZeroes = false): string {
  let amOrpm = '';
  if (!use24Hour) {
    amOrpm = h < 12 ? 'AM' : 'PM';
  }

  const formattedHours = use24Hour ? h : (h - 1) % 12 + 1;
  const padZero = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
  return `${padZeroes ? padZero.format(formattedHours) : formattedHours}:${padZero.format(m)}${amOrpm}`;
}

/**
 * Creates fake mouse events at a certain time. For use in testing.
 * @param h hours of the desired time, in 24-hr format
 * @param m minutes of the desired time
 * @param offset top of the calendar day in which the event is fired
 * @param clientHeight height of the calendar day
 */
export const timeToEvent = (h: number, m: number, offset = 0, clientHeight = 1000): {} => {
  const minsPastStart = h * 60 + m - FIRST_HOUR * 60;
  const minsPerDay = (LAST_HOUR - FIRST_HOUR) * 60;

  return {
    button: 0,
    clientY: offset + minsPastStart / minsPerDay * clientHeight,
    clientX: 100,
  };
};

interface FirstLastHour {
  first: number;
  last: number;
}

/**
 * Determines the first and last hour of the schedule, depending on whether
 * @param schedule The schedule to determine the hours for
 * @param fullscreen Whether we're fullscreen or not
 * @returns FirstLastHour enum, containing the first and last hour of the schedule
 */
export function getFirstAndLastHour(schedule: Meeting[], fullscreen: boolean): FirstLastHour {
  let earliest = Number.MAX_VALUE;
  let latest = Number.MIN_VALUE;

  // Retrieve min/max start & end times
  schedule.forEach((meeting) => {
    if (meeting.startTimeHours !== 0 && meeting.startTimeHours < earliest) {
      earliest = meeting.startTimeHours;
    }

    if (meeting.endTimeHours !== 0 && meeting.endTimeHours > latest) {
      latest = meeting.endTimeHours;
    }
  });

  const MIN = 8; // The minimum amonut of time between earliest and latest

  // Check to ensure the time between latest and earliest is < MIN, and correct it if not
  // Also ensure we're not doing this calculation when the schedule is empty
  if (schedule.length > 0 && latest - earliest < MIN) {
    // Means our latest class is after 3 - set it to noon
    if (earliest + MIN >= LAST_HOUR) {
      // Latest hour always gets an hour added to it, so account for that
      earliest = latest + 1 - MIN;
    } else {
      // Expand it
      latest = earliest + MIN;
    }
  }

  // Use earliest & latest if we're fullscreen
  let first = FIRST_HOUR;
  let last = LAST_HOUR;
  if (fullscreen && schedule.length > 0) {
    first = earliest;
    last = latest + 1;
  }

  return { first, last };
}
