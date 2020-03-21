import DayOfWeek from './DayOfWeek';

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
