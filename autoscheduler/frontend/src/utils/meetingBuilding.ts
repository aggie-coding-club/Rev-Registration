import Meeting from '../types/Meeting';

export default function meetingBuilding(meeting: Meeting): string {
  return meeting.building ? meeting.building : 'ONLINE';
}

export function meetingBuildingWithRoom(meeting: Meeting): string {
  // A few sections have ONLINE as both the building * room, so return ONLINE for these instead
  return meeting.building && meeting.building !== 'ONLINE'
    ? `${meeting.building} ${meeting.room}`
    : 'ONLINE';
}
