import Meeting from "../types/Meeting";

export default function meetingBuilding(meeting: Meeting): string {
  return meeting.building || 'ONLINE';
}
