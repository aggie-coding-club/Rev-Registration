import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import * as styles from './Schedule.css';
import Meeting from '../../types/Meeting';
import MeetingCard from '../MeetingCard/MeetingCard';

interface ScheduleProps extends RouteComponentProps {
  schedule: Meeting[];
}

const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
  // these must be unique because of how they're used below
  const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F'];
  const FIRST_HOUR = 8;
  const LAST_HOUR = 21;

  // build header tiles from days of week
  const headerTiles = DAYS_OF_WEEK.map((letter) => (
    <div key={letter} className={styles.headerTile}>
      {letter}
    </div>
  ));

  // build rows from first and last hour
  const HOURS_OF_DAY = [];
  for (let h = FIRST_HOUR; h <= LAST_HOUR; h++) { HOURS_OF_DAY.push(h); }
  const hourBars = HOURS_OF_DAY.map((hour) => (
    <div className={styles.calendarRow} key={hour}>
      <div className={styles.hourLabel}>
        {((hour - 1) % 12) + 1}
      </div>
      <div className={styles.hourMarker} />
    </div>
  ));

  // build each day based on schedule
  function getMeetingsForDay(day: number): Meeting[] {
    // meetingDays = UMTWRFS
    // day = MTWRF
    return schedule.filter((meeting) => meeting.meetingDays[day + 1]);
  }
  function renderMeeting(meeting: Meeting): JSX.Element {
    return (
      <MeetingCard meeting={meeting} bgColor="#500000" key={meeting.id} firstHour={FIRST_HOUR} lastHour={LAST_HOUR} />
    );
  }
  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    <div className={styles.calendarDay} key={day}>
      {getMeetingsForDay(idx).map((mtg) => renderMeeting(mtg))}
    </div>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {headerTiles}
      </div>
      <div className={styles.calendarBody}>
        {hourBars}
        <div className={styles.meetingsContainer}>
          {scheduleDays}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
