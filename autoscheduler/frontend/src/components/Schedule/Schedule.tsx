import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './Schedule.css';
import Meeting from '../../types/Meeting';
import MeetingCard from '../MeetingCard/MeetingCard';
import { RootState } from '../../redux/reducers';
import {
  addAvailability, updateAvailability, setSelectedAvailability, mergeAvailability,
} from '../../redux/actions';
import Availability, { AvailabilityType, AvailabilityArgs } from '../../types/Availability';
import AvailabilityCard from '../AvailabilityCard/AvailabilityCard';
import HoveredTime from './HoveredTime/HoveredTime';

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
  const selectedAvailability = useSelector<RootState, AvailabilityArgs>(
    (state) => state.selectedAvailability,
  );
  const dispatch = useDispatch();

  /* state */
  const [startDay, setStartDay] = React.useState(null);
  // either the start or end time, in minutes since midnight,
  // for the availability currently being added
  const [time1, setTime1] = React.useState(null);

  // state management for time display
  const [hoveredDay, setHoveredDay] = React.useState(null);
  const [mouseY, setMouseY] = React.useState<number>(null);
  const [hoveredTime, setHoveredTime] = React.useState<number>(null);

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
    const totalY = evt.currentTarget.clientHeight;
    const yPercent = (evt.clientY - evt.currentTarget.getBoundingClientRect().top) / totalY;
    const minutesPerDay = (LAST_HOUR - FIRST_HOUR) * 60;
    const yMinutes = yPercent * minutesPerDay;
    const roundedMinutes = Math.round(yMinutes / 10) * 10;
    return roundedMinutes + FIRST_HOUR * 60;
  }

  function handleMouseDown(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, idx: number): void {
    // ignores everything except left mouse button
    if (evt.button !== 0) return;

    setStartDay(idx);
    const newTime1 = eventToTime(evt);
    setTime1(newTime1);
  }

  function handleMouseMove(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    // update position of time display
    setMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
    const time2 = eventToTime(evt);
    setHoveredTime(time2);

    // if the mouse hasn't been pressed down, don't add an availability
    if (!time1) return;

    if (selectedAvailability) {
      // if the user is dragging an availability, update it
      dispatch(updateAvailability({
        ...selectedAvailability,
        time2,
      }));
    } else {
      // if the user is not dragging an existing availability, add a new one
      // and select it for updating
      dispatch(addAvailability({
        dayOfWeek: startDay,
        available: availabilityMode,
        time1,
        time2,
      }));
      dispatch(setSelectedAvailability({
        dayOfWeek: startDay,
        available: availabilityMode,
        time1,
        time2,
      }));
    }
  }

  function handleMouseUp(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    // ignores everything except left mouse button
    if (evt.button !== 0) return;

    // stop dragging an availability
    if (selectedAvailability) {
      dispatch(mergeAvailability());
      dispatch(setSelectedAvailability(null));
      setTime1(null);
      setStartDay(null);
      return;
    }

    // ensure that blocks of time are at least 30 minutes wide
    const time2 = eventToTime(evt);
    const blockSize = Math.abs(time2 - time1);
    if (blockSize < 30) {
      if (time2 < 20 * 60 + 30) {
        dispatch(addAvailability({
          dayOfWeek: startDay,
          available: availabilityMode,
          time1,
          time2: time1 + 30 * ((blockSize) / (time2 - time1) || 1), // trick to correct the sign
        }));
      } else {
        // new time blocks cannot be later than 9 PM / 2100
        dispatch(addAvailability({
          dayOfWeek: startDay,
          available: availabilityMode,
          time1: 20 * 60 + 30,
          time2: 21 * 60,
        }));
      }
    }

    setTime1(null);
    setStartDay(null);
  }

  function handleMouseEnter(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, day: number): void {
    setHoveredDay(day);
    setMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
    setHoveredTime(eventToTime(evt));
  }

  function handleMouseLeave(): void {
    setHoveredDay(null);
    setMouseY(null);
    setHoveredTime(null);
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

  // let's see if useMemo reduces our render time
  const meetingsForDays = React.useMemo(() => [0, 1, 2, 3, 4].map(
    (idx) => getMeetingsForDay(idx).map((mtg) => renderMeeting(mtg)),
  ), [schedule]);
  const availabilitiesForDays = React.useMemo(() => [0, 1, 2, 3, 4].map(
    (idx) => getAvailabilityForDay(idx).map((avl) => renderAvailability(avl)),
  ), [availabilityList]);

  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    // this is temporary, eventually we should make it more accessible
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={styles.calendarDay}
      key={day}
      onMouseDown={(evt): void => handleMouseDown(evt, idx)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={(evt): void => handleMouseEnter(evt, idx)}
      onMouseLeave={handleMouseLeave}
    >
      { meetingsForDays[idx] }
      { availabilitiesForDays[idx] }
      {
        // render time display
        hoveredDay === idx ? <HoveredTime mouseY={mouseY} time={hoveredTime} /> : null
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
