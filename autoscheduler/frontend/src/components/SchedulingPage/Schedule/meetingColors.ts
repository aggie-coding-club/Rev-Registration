import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

export const colors = [
  '#f2c05b', '#ec4631', '#b42a4b', '#83205c',
  '#227d9c', '#2d683e', '#c47652', '#612b0d', '#249889',
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
