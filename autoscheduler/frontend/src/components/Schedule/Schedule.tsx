import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { CSSProperties } from '@material-ui/styles';
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

  const [startTimeHours, setStartTimeHours] = React.useState<number>(null);
  const [startTimeMinutes, setStartTimeMinutes] = React.useState<number>(null);
  const [endTimeHours, setEndTimeHours] = React.useState<number>(null);
  const [endTimeMinutes, setEndTimeMinutes] = React.useState<number>(null);
  const [timeViewDay, setTimeViewDay] = React.useState<number>(null);


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
  function renderMeeting(meeting: Meeting, day: number): JSX.Element {
    return (
      <MeetingCard
        meeting={meeting}
        bgColor="#500000"
        key={meeting.id}
        firstHour={FIRST_HOUR}
        lastHour={LAST_HOUR}
        onMouseEnter={(): void => {
          setStartTimeHours(meeting.startTimeHours);
          setStartTimeMinutes(meeting.startTimeMinutes);
          setEndTimeHours(meeting.endTimeHours);
          setEndTimeMinutes(meeting.endTimeMinutes);
          setTimeViewDay(day);
        }}
        onMouseLeave={(): void => {
          setStartTimeHours(null);
          setStartTimeMinutes(null);
          setEndTimeHours(null);
          setEndTimeMinutes(null);
          setTimeViewDay(null);
        }}
      />
    );
  }
  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    <div className={styles.calendarDay} key={day}>
      {getMeetingsForDay(idx).map((mtg) => renderMeeting(mtg, idx))}
    </div>
  ));

  // calculates the position of the start time view label
  const computePositionStart = (): CSSProperties => ({
    top: `calc(${((startTimeHours * 60 + startTimeMinutes - FIRST_HOUR * 60)
         / ((LAST_HOUR - FIRST_HOUR) * 60)) * 100}% - 26px)`,
  });

  // calculates the position of teh end time view label
  function computePositionEnd(): CSSProperties {
    return {
      top: `calc(${((endTimeHours * 60 + endTimeMinutes - FIRST_HOUR * 60)
        / ((LAST_HOUR - FIRST_HOUR) * 60)) * 100}% - 2px)`,
    };
  }

  // computes position and size for dashed lines to time view
  function computeStyleForLines(): CSSProperties {
    const elapsedTime = endTimeHours * 60 + endTimeMinutes - startTimeHours * 60 - startTimeMinutes;
    return {
      top: `${((startTimeHours * 60 + startTimeMinutes - FIRST_HOUR * 60)
        / ((LAST_HOUR - FIRST_HOUR) * 60)) * 100}%`,
      height: `calc(${((elapsedTime) / ((LAST_HOUR - FIRST_HOUR) * 60)) * 100}% - 4px)`,
      width: `${timeViewDay * 20}%`,
    };
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        {headerTiles}
      </div>
      <div className={styles.calendarBody}>
        {hourBars}
        <div className={styles.startTime} style={computePositionStart()}>
          10:20
        </div>
        <div className={styles.endTime} style={computePositionEnd()}>
          11:10
        </div>
        <div className={styles.meetingsContainer}>
          <div className={styles.timeViewLines} style={computeStyleForLines()} />
          {scheduleDays}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
