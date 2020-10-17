import Meeting from '../types/Meeting';

// sorts meeetings based on meeting type
const sortMeeting = (a: Meeting, b: Meeting): number => {
  const value = a.meetingType - b.meetingType;
  return value;
};
export default sortMeeting;
