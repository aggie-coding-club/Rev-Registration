import * as React from 'react';
import Meeting from '../../../types/Meeting';
import { LAST_HOUR, FIRST_HOUR } from '../../../timeUtil';
import DayOfWeek from '../../../types/DayOfWeek';
import * as styles from '../Schedule/Schedule.css';
import colors from '../Schedule/meetingColors';

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
    <div className={styles.calendarRow} key={hour}>
      <div className={styles.hourMarker} />
    </div>
  ));

  // let's see if useMemo reduces our render time
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
        width: '100%',
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

  const FULL_WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    <div
      className={styles.calendarDay}
      key={day}
      role="gridcell"
      tabIndex={0}
      aria-label={FULL_WEEK_DAYS[idx]}
    >
      { meetingsForDays[idx] }
    </div>
  ));

  return (
    <div style={{
      width: '100%', alignSelf: 'stretch', minHeight: 120, margin: 8,
    }}
    >
      <div style={{
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        height: 8,
        backgroundColor: '#500000',
      }}
      />
      <div className={styles.calendarBody} style={{ height: '100%', backgroundColor: 'white' }}>
        {hourBars}
        <div className={styles.meetingsContainer} style={{ width: '100%', marginLeft: 0 }}>
          {scheduleDays}
        </div>
      </div>
    </div>
  );
};

export default MiniSchedule;
