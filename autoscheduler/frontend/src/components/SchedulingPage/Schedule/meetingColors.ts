import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

export const colors = [
  '#f2c05b', // tan
  '#2d683e', // green
  '#ec4631', // orange
  '#227d9c', // blue
  '#c82041', // red
  '#612b0d', // dark brown
  '#83205c', // purple
  '#c47668', // light brown/pink
  '#249889', // turquoise
];

export default function useMeetingColor(): Map<string, string> {
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

  const sectionToColor = new Map<string, string>();
  [...allSectionIds.keys()].forEach((courseName, idx) => {
    sectionToColor.set(courseName, colors[idx % colors.length]);
  });
  return sectionToColor;
}
