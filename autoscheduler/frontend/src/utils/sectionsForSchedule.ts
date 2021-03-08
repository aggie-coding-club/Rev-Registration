import Schedule from '../types/Schedule';
import Section from '../types/Section';

/**
 * Returns unique sections for a schedule, assuming that meetings from the same section are adjacent
 * Also reverses the order of the sections to match those in the course cards
 * @param schedule Schedule to get sections for
 */
export default function sectionsForSchedule(schedule: Schedule): Section[] {
  return schedule.meetings.reduce((acc, curr) => {
    const lastSection = acc[acc.length - 1];
    if (!lastSection || lastSection.id !== curr.section.id) {
      return acc.concat(curr.section);
    }
    return acc;
  }, []).reverse();
}
