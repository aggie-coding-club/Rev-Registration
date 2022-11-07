import Schedule from '../types/Schedule';
import sectionsForSchedule from './sectionsForSchedule';

/**
 * Returns the total number of hours of sections in a schedule.
 * If there are `maxCredits` in the sections, it will return a range (e.g. "1 - 3")
 * Otherwise, it will just add up all of the `minCredit`s.
 */
export default function hoursForSchedule(schedule: Schedule): string {
  if (!schedule) return '-';
  const minCredits = String(sectionsForSchedule(schedule).reduce((acc, section) => (
    acc + (section.minCredits)
  ), 0));

  const maxCredits = String(sectionsForSchedule(schedule).reduce((acc, section) => (
    acc + (section.maxCredits ?? section.minCredits)
  ), 0));

  // There's a few sections where maxCredits is the same as minCredits (about 1%)
  // as such, don't show a range of this case.
  if (minCredits === maxCredits) {
    return minCredits;
  }

  return `${minCredits} - ${maxCredits}`;
}
