import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducer';

export const colors = [
  '#500000', '#733333', '#966666', '#b99999',
  '#871b1e', '#9a1d26', '#c2777d', '#9f494b', '#b76778',
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
