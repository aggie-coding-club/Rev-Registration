import DayOfWeek from './DayOfWeek';
import { LAST_HOUR, FIRST_HOUR } from '../utils/timeUtil';

export enum AvailabilityType {
  NONE, BUSY
}

/**
 * A block of availability, which occurs on a particular day of the week, from a specific start
 * time to a specific end time, and is of one of the valid `AvailabilityType`s
 */
export default interface Availability {
  dayOfWeek: DayOfWeek;
  startTimeHours: number;
  startTimeMinutes: number;
  endTimeHours: number;
  endTimeMinutes: number;
  available: AvailabilityType;
}

/**
 * Represents arguments passed to an availability action to describe a block of availability.
 * The primary difference between this and `Availability` is that the start and end times
 * are passed as `time1` and `time2`, which are measured in minutes past midnight and
 * interpreted flexibly by the reducer.
 *
 * When adding availabilties, `time1` should be the start time and `time2` should be the end
 * time, but when updating availabilities, `time1` should be the unchanged time and `time2`
 * should be the changed time.
 */
export interface AvailabilityArgs {
  dayOfWeek: DayOfWeek;
  time1: number;
  time2: number;
  available: AvailabilityType;
}

/**
 * Converts a set of `AvailabilityArgs` to an `Availability` object
 * @param avArgs
 */
export function argsToAvailability(avArgs: AvailabilityArgs): Availability {
  const startTime = Math.min(avArgs.time1, avArgs.time2);
  const startTimeHours = Math.floor(startTime / 60);
  const startTimeMinutes = startTime % 60;
  const endTime = Math.max(avArgs.time1, avArgs.time2);
  const endTimeHours = Math.floor(endTime / 60);
  const endTimeMinutes = endTime % 60;

  return {
    dayOfWeek: avArgs.dayOfWeek,
    available: avArgs.available,
    startTimeHours,
    startTimeMinutes,
    endTimeHours,
    endTimeMinutes,
  };
}

/**
   * Using time1 and time2 from the given availability, returns arguments for
   * an availability that is at least 30 minutes long and ends before LAST_HOUR
   * (currently 10 PM)
   */
export function roundUpAvailability(avl: AvailabilityArgs): AvailabilityArgs[] {
  const blockSize = Math.abs(avl.time2 - avl.time1);
  if (blockSize < 30) {
    if (avl.time2 < (LAST_HOUR - 1) * 60 + 30 || avl.time1 > avl.time2) {
      if (avl.time1 > FIRST_HOUR * 60 + 30 || avl.time1 < avl.time2) {
        // if the availability is solidly between 8:30 and 21:30, just round up
        // also works if the un-dragged time is earlier than the dragged one
        return [{
          ...avl,
          // if the sign is zero, then assumes positive by default
          time2: avl.time1 + 30 * (Math.sign(avl.time2 - avl.time1) || 1),
        }];
      }

      // if availability is close to the edges, force it to 8 to 8:30 in 2 steps
      return [{
        ...avl,
        time2: FIRST_HOUR * 60,
      }, {
        ...avl,
        time1: FIRST_HOUR * 60,
        time2: FIRST_HOUR * 60 + 30,
      }];
    }
    // new time blocks cannot be later than 10 PM / 2200
    return [{
      ...avl,
      time2: LAST_HOUR * 60,
    }, {
      ...avl,
      time1: LAST_HOUR * 60,
      time2: (LAST_HOUR - 1) * 60 + 30,
    }];
  }

  // if there are no problems, just use avl as is
  return [avl];
}
