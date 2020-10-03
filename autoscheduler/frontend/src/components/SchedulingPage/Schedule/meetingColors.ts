import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

export const colors = [
  '#d19642', '#ec4631', '#951c26', '#73203c',
  '#227d9c', '#2d683e', '#c47652', '#612b0d', '#249889',
];

export default function useMeetingColor(): Map<string, string> {
  const allSectionIds = new Set(useSelector<RootState, string[]>(
    (state) => state.schedules.allSchedules.reduce<string[]>(
      (arr, schedule) => arr.concat(
        schedule.map(
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
