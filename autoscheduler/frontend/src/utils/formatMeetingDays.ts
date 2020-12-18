import Meeting from '../types/Meeting';

export default function formatMeetingDays(meeting: Meeting): string {
  const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
  return meeting.meetingDays.reduce((acc, curr, idx) => (curr ? acc + DAYS_OF_WEEK[idx] : acc), '');
}
