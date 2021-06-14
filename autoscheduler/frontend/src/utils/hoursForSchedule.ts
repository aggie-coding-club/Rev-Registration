import Schedule from '../types/Schedule';
import sectionsForSchedule from './sectionsForSchedule';

export default function hoursForSchedule(schedule: Schedule): number {
  return sectionsForSchedule(schedule).reduce((acc, section) => acc + section.minCredits, 0);
}
