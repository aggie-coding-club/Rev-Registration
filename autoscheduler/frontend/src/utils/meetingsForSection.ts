import Meeting from '../types/Meeting';
import Section from '../types/Section';

/**
   * Accepts an array of meetings and returns a filtered array without duplicate meetings.
   * Meetings are considered to be duplicates if they are of the same type, meet on the same days,
   * and start at the same time. Meetings that are the same by all of these criteria but
   * differ only in the end times will still be considered duplicates
   * @param arr
   */
function filterDuplicateMeetings(meetings: Meeting[]): Meeting[] {
  // helper function to merge two meetings
  const mergeMeetings = (mtg1: Meeting, mtg2: Meeting): Meeting => {
    if (!mtg2) return mtg1;

    // choose the later end time
    const [laterEndHours, laterEndMinutes] = mtg2.endTimeHours > mtg1.endTimeHours
      ? [mtg2.endTimeHours, mtg2.endTimeMinutes]
      : [mtg1.endTimeHours, mtg1.endTimeMinutes];
      // merge the days array by logical OR of each element
    const days = mtg1.meetingDays.map((hasMeeting, idx) => hasMeeting || mtg2.meetingDays[idx]);
    return {
      ...mtg1,
      endTimeHours: laterEndHours,
      endTimeMinutes: laterEndMinutes,
      meetingDays: days,
    };
  };

  // add all meetings to a map, then get the values of the map
  const uniqueMeetings = new Map<string, Meeting>();
  meetings.forEach((mtg) => {
    const key = `${mtg.meetingType}${mtg.startTimeHours}${mtg.startTimeMinutes}`;
    uniqueMeetings.set(key, mergeMeetings(mtg, uniqueMeetings.get(key)));
  });
  return [...uniqueMeetings.values()];
}

/**
 * Returns the unique meetings for a particular section
 * @param section Section to find unique meetings for
 * @param meetings List of meetings to process
 */
export default function meetingsForSection(section: Section, meetings: Meeting[]): Meeting[] {
  return filterDuplicateMeetings(meetings.filter((mtg) => mtg.section.id === section.id));
}
