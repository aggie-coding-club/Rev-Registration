import Meeting, { MeetingType } from '../types/Meeting';

// sorts meeetings based on meeting type
const sortMeeting = (a: Meeting, b: Meeting): number => {
  if (a.meetingType > b.meetingType) {
    return 1;
  }
  if (a.meetingType < b.meetingType) {
    return -1;
  }
  return 0;
};
export default sortMeeting;