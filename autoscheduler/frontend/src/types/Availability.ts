export enum AvailabilityType {
  NONE, BUSY
}

export default interface Availability {
  dayOfWeek: number;
  startTimeHours: number;
  startTimeMinutes: number;
  endTimeHours: number;
  endTimeMinutes: number;
  available: AvailabilityType;
// eslint-disable-next-line semi
}

export interface AvailabilityArgs {
  dayOfWeek: number;
  time1: number;
  time2: number;
  available: AvailabilityType;
}

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
