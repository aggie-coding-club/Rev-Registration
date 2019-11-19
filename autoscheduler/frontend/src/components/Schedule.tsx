import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import * as styles from './Schedule.css';
import Meeting from '../types/Meeting';

interface ScheduleProps extends RouteComponentProps {
  schedule: Meeting[];
}

const Schedule: React.FC<ScheduleProps> = ({ schedule }) => {
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {headerTiles}
      </div>
      <div className={styles.calendarBody}>
        {hourBars}
        <div className={styles.meetingsContainer}>
          {schedule[0].crn}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
