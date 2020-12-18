import Meeting from "../types/Meeting";
import { formatTime } from "./timeUtil";

export default function meetingTimeText(mtg: Meeting): string {
  if (mtg.startTimeHours === 0) {
    // If the time is 00:00, then it's meeting time is not applicable
    return 'N/A';
  }

  // Returns it in the format 12:00 - 1:00
  return `${formatTime(mtg.startTimeHours, mtg.startTimeMinutes)}
      - ${formatTime(mtg.endTimeHours, mtg.endTimeMinutes)}`;
}
