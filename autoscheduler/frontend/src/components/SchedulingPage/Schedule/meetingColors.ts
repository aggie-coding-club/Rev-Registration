import Meeting from '../../../types/Meeting';

export const meetingColors = [
  '#500000', '#733333', '#966666', '#b99999',
  '#871b1e', '#9a1d26', '#c2777d', '#9f494b', '#b76778',
];

export default function useMeetingColor(): Function {
  return (schedule: Meeting[], sectionId: number): string => {
    const uniqueSections = [...new Set(schedule.map((mtg: Meeting) => mtg.section.id))];
    return meetingColors[
      uniqueSections.indexOf(sectionId) % meetingColors.length
    ];
  };
}
