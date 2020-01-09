import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './Schedule.css';
import Meeting from '../../types/Meeting';
import MeetingCard from '../MeetingCard/MeetingCard';
import { RootState } from '../../redux/reducers';
import { addAvailability } from '../../redux/actions';
import Availability, { AvailabilityType } from '../../types/Availability';
import AvailabilityCard from '../AvailabilityCard';

const Schedule: React.FC<RouteComponentProps> = () => {
  // these must be unique because of how they're used below
  const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F'];
  const FIRST_HOUR = 8;
  const LAST_HOUR = 21;

  // "props" derived from Redux store
  const schedule = useSelector<RootState, Meeting[]>((state) => state.meetings);
  const availabilityList = useSelector<RootState, Availability[]>((state) => state.availability);
  const availabilityMode = useSelector<RootState, AvailabilityType>(
    (state) => state.availabilityMode,
  );
  const dispatch = useDispatch();

  /* state */
  const [startDay, setStartDay] = React.useState(null);
  // either the start or end time, in minutes since midnight,
  // for the availability currently being added
  const [time1, setTime1] = React.useState(null);

  // helper functions
  function formatHours(hours: number): number {
    return ((hours - 1) % 12) + 1;
  }

  /**
   * Given a MouseEvent in a calendar day, calculates the time, in minutes since midnight
   * and rounded to the nearest 10, at which the mouse event was emitted
   * @param evt
   */
  function eventToTime(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): number {
    const totalY = (evt.currentTarget as HTMLDivElement).clientHeight;
    const yPercent = (evt.clientY - 110) / totalY; // DEBUG the 110 here was measured experimentally
    const minutesPerDay = (LAST_HOUR - FIRST_HOUR) * 60;
    const yMinutes = yPercent * minutesPerDay;
    const roundedMinutes = Math.round(yMinutes / 10) * 10;
    return roundedMinutes + FIRST_HOUR * 60;
  }

  function handleMouseDown(day: string, evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    setStartDay(DAYS_OF_WEEK.indexOf(day));
    setTime1(eventToTime(evt));
  }

  function handleMouseUp(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const time2 = eventToTime(evt);
    const startTime = Math.min(time1, time2);
    const startTimeHours = Math.floor(startTime / 60);
    const startTimeMinutes = startTime % 60;
    const endTime = Math.max(time1, time2);
    const endTimeHours = Math.floor(endTime / 60);
    const endTimeMinutes = endTime % 60;

    dispatch(addAvailability({
      dayOfWeek: startDay,
      startTimeHours,
      startTimeMinutes,
      endTimeHours,
      endTimeMinutes,
      available: availabilityMode,
    }));
  }

  /* values computed from props */
  const uniqueSections = [...new Set(schedule.map((mtg: Meeting) => mtg.section.id))];

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
        {`${formatHours(hour)}:00`}
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
  function getAvailabilityForDay(day: number): Availability[] {
    return availabilityList.filter((avl) => avl.dayOfWeek === day);
  }
  function renderMeeting(meeting: Meeting): JSX.Element {
    const colors = ['#500000', '#733333', '#966666', '#b99999', '#dccccc'];
    return (
      <MeetingCard
        meeting={meeting}
        bgColor={colors[uniqueSections.indexOf(meeting.section.id)]}
        key={meeting.id}
        firstHour={FIRST_HOUR}
        lastHour={LAST_HOUR}
      />
    );
  }
  function renderAvailability(availability: Availability): JSX.Element {
    return (
      <AvailabilityCard
        availability={availability}
        firstHour={FIRST_HOUR}
        lastHour={LAST_HOUR}
        key={`${availability.startTimeHours}:${availability.startTimeMinutes}`}
      />
    );
  }
  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    // this is temporary, eventually we should make it more accessible
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={styles.calendarDay}
      key={day}
      onMouseDown={(evt): void => handleMouseDown(day, evt)}
      onMouseUp={(evt): void => handleMouseUp(evt)}
    >
      {
        // render meetings
        getMeetingsForDay(idx).map((mtg) => renderMeeting(mtg)).concat(
          // render availability
          getAvailabilityForDay(idx).map((avl) => renderAvailability(avl)),
        )
      }
    </div>
  ));

  return (
    <div className={styles.calendarContainer}>
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
