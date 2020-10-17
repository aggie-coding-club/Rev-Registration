import Meeting from '../types/Meeting';

// sorts meeetings based on meeting type
const sortMeeting = (a: Meeting, b: Meeting): number => { return a.meetingType - b.meetingType; }
export default sortMeeting;
