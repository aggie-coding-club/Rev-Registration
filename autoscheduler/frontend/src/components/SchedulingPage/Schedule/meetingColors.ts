import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

export const colors = [
  '#f2c05b', // yellow
  '#2d683e', // green
  '#ec4631', // orange
  '#227d9c', // blue
  '#83205c', // purple
  '#db728e', // light brown/pink
  '#249889', // turquoise
  '#c82041', // red
  '#612b0d', // dark brown
];

let lastSectionIds = new Set<string>();
let lastMap: Map<string, string> = null;
const isSetEqual = (a: Set<string>, b: Set<string>): boolean => a.size === b.size
  && [...a].every((val) => b.has(val));

export default function useMeetingColor(): Map<string, string> {
  // go through every section in every schedule and make a set of unique ID's
  const allSectionIds = new Set(useSelector<RootState, string[]>(
    (state) => state.schedules.reduce<string[]>(
      (arr, schedule) => arr.concat(
        schedule.meetings.map(
          (meeting) => meeting.section.subject + meeting.section.courseNum,
        ),
      ),
      [],
    ),
  ));

  if (lastSectionIds && isSetEqual(allSectionIds, lastSectionIds)) return lastMap;

  const sectionToColor = new Map<string, string>();
  [...allSectionIds.keys()].forEach((courseName, idx) => {
    sectionToColor.set(courseName, colors[idx % colors.length]);
  });

  // memo-izde values for next time
  lastSectionIds = allSectionIds;
  lastMap = sectionToColor;

  return sectionToColor;
}
