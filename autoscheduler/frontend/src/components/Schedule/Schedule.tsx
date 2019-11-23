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

  // declare state
  const [startTimeHours, setStartTimeHours] = React.useState<number>(null);
  const [startTimeMinutes, setStartTimeMinutes] = React.useState<number>(null);
  const [endTimeHours, setEndTimeHours] = React.useState<number>(null);
  const [endTimeMinutes, setEndTimeMinutes] = React.useState<number>(null);
  const [timeViewDay, setTimeViewDay] = React.useState<number>(null);

  // helper functions for formatting
  function formatHours(hours: number): number {
    return ((hours - 1) % 12) + 1;
  }

  function formatMinutes(minutes: number): string {
    return new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(minutes);
  }

  // values computed from props
  const uniqueSections = [...new Set([...schedule.map((mtg: Meeting) => mtg.section)])];
  // TODO convert to mtg.section.id

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
        {formatHours(hour)}
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
    const colors = ['#500000', '#733333', '#966666', '#b99999', '#dccccc'];
    return (
      <MeetingCard
        meeting={meeting}
        bgColor={colors[uniqueSections.indexOf(meeting.section)]}
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
  function computePositionStart(): CSSProperties {
    return {
      top: `calc(${((startTimeHours * 60 + startTimeMinutes - FIRST_HOUR * 60)
         / ((LAST_HOUR - FIRST_HOUR) * 60)) * 100}% - 26px)`,
    };
  }

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
        {/* <div className={styles.timeViewContainer}>

        </div> */}
        <div className={styles.meetingsContainer}>
          { startTimeHours // renders only if start time hours is not null and not zero
            ? (
              <div>
                <div className={styles.startTime} style={computePositionStart()}>
                  {`${formatHours(startTimeHours)}:${formatMinutes(startTimeMinutes)}`}
                </div>
                <div className={styles.endTime} style={computePositionEnd()}>
                  {`${formatHours(endTimeHours)}:${formatMinutes(endTimeMinutes)}`}
                </div>
              </div>
            ) : null}
          <div className={styles.timeViewLines} style={computeStyleForLines()} />
          {scheduleDays}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
