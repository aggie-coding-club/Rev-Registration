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
  const [startTimeHours, setStartTimeHours] = React.useState(null);
  const [startTimeMinutes, setStartTimeMinutes] = React.useState(null);

  // helper functions
  function formatHours(hours: number): number {
    return ((hours - 1) % 12) + 1;
  }

  function eventToTime(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): number[] {
    const totalY = (evt.currentTarget as HTMLDivElement).clientHeight;
    const yPercent = evt.clientY / totalY;
    const minutesPerDay = (LAST_HOUR - FIRST_HOUR) * 60;
    const yMinutes = yPercent * minutesPerDay;
    const roundedMinutes = Math.round(yMinutes / 10) * 10 - 190;
    const hours = Math.floor(roundedMinutes / 60) + FIRST_HOUR;
    const minutes = roundedMinutes % 60;
    return [hours, minutes];
  }

  function handleMouseDown(day: string, evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const [hours, minutes] = eventToTime(evt);
    setStartDay(DAYS_OF_WEEK.indexOf(day));
    setStartTimeHours(hours);
    setStartTimeMinutes(minutes);
  }

  function handleMouseUp(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const [hours, minutes] = eventToTime(evt);
    dispatch(addAvailability({
      dayOfWeek: startDay,
      startTimeHours,
      startTimeMinutes,
      endTimeHours: hours,
      endTimeMinutes: minutes,
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
        key={`${availability.startTimeHours}`}
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
