import * as React from 'react';
import Meeting from '../../../../types/Meeting';
import { LAST_HOUR, FIRST_HOUR } from '../../../../timeUtil';
import DayOfWeek from '../../../../types/DayOfWeek';
import * as parentStyles from '../../Schedule/Schedule.css';
import * as styles from './MiniSchedule.css';
import colors from '../../Schedule/meetingColors';

interface MiniScheduleProps {
  schedule: Meeting[];
}

const MiniSchedule: React.FC<MiniScheduleProps> = ({ schedule }) => {
  // these must be unique because of how they're used below
  const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F'];

  // build rows from first and last hour
  const HOURS_OF_DAY = [];
  for (let h = FIRST_HOUR; h <= LAST_HOUR; h++) { HOURS_OF_DAY.push(h); }
  const hourBars = HOURS_OF_DAY.map((hour) => (
    <div className={parentStyles.calendarRow} key={hour}>
      <div className={styles.hourMarker} style={{ top: 0 }} />
    </div>
  ));

  /**
   * An array of arrays, in which each outer array represents a calendar day and each
   * inner array represents the meetings for that day
   */
  const meetingsForDays = React.useMemo(() => {
    const uniqueSections = [...new Set(schedule.map((mtg: Meeting) => mtg.section.id))];
    // build each day based on schedule
    function getMeetingsForDay(day: number): Meeting[] {
      // meetingDays = UMTWRFS
      // day = MTWRF
      return schedule.filter((meeting) => meeting.meetingDays[day]);
    }
    function renderMeeting(meeting: Meeting): JSX.Element {
      const {
        endTimeHours, endTimeMinutes, startTimeHours, startTimeMinutes,
      } = meeting;
      const elapsedTime = endTimeHours * 60 + endTimeMinutes
        - startTimeHours * 60 - startTimeMinutes;
      const computedStyle: React.CSSProperties = {
        position: 'absolute',
        width: 'calc(100% - 4px)',
        marginLeft: 2,
        marginRight: 2,
        height: `calc(${elapsedTime / (LAST_HOUR - FIRST_HOUR) / 60 * 100}%)`,
        top: `${(startTimeHours * 60 + startTimeMinutes - FIRST_HOUR * 60) / (LAST_HOUR - FIRST_HOUR) / 60 * 100}%`,
        backgroundColor: colors[uniqueSections.indexOf(meeting.section.id) % colors.length],
      };
      return (
        <div
          key={meeting.id}
          style={computedStyle}
        />
      );
    }
    return [DayOfWeek.MON, DayOfWeek.TUE, DayOfWeek.WED, DayOfWeek.THU, DayOfWeek.FRI].map(
      (idx) => getMeetingsForDay(idx).map((mtg) => renderMeeting(mtg)),
    );
  }, [schedule]);

  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    <div
      className={parentStyles.calendarDay}
      key={day}
    >
      { meetingsForDays[idx] }
    </div>
  ));

  return (
    <div className={styles.miniScheduleContainer}>
      <div className={styles.header} />
      <div className={styles.calendarBody}>
        {hourBars}
        <div className={styles.meetingsContainer}>
          {scheduleDays}
        </div>
      </div>
    </div>
  );
};

export default MiniSchedule;
