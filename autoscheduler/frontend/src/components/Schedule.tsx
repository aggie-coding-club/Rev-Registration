/* eslint-disable no-mixed-operators */
import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import * as styles from './Schedule.css';
import Meeting from '../types/Meeting';

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
        {hour}
      </div>
      <div className={styles.hourMarker} />
    </div>
  ));

  // build each day based on schedule
  function getMeetingsForDay(day: number): Meeting[] {
    return schedule.filter((meeting) => meeting.meetingDays[day]);
  }
  function renderMeeting({
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, id,
  }: Meeting): JSX.Element {
    const elapsedTime = endTimeHours * 60 + endTimeMinutes - startTimeHours * 60 - startTimeMinutes;
    const computedStyle = {
      height: `${elapsedTime / (LAST_HOUR - FIRST_HOUR) / 60 * 100}%`,
      width: '100%',
      top: `${(startTimeHours * 60 + startTimeMinutes - FIRST_HOUR * 60) / (LAST_HOUR - FIRST_HOUR) / 60 * 100}%`,
      position: 'relative' as 'relative',
      backgroundColor: '#500000',
      color: 'white',
      borderRadius: 4,
      margin: 2,
    };
    return (
      <div style={computedStyle} key={id}>
        Insert Meeting Here
      </div>
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
