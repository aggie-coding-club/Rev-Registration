import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './Schedule.css';
import Meeting from '../../types/Meeting';
import MeetingCard from './MeetingCard/MeetingCard';
import { RootState } from '../../redux/reducer';
import { addAvailability, updateAvailability, mergeAvailability } from '../../redux/actions/availability';
import { setSelectedAvailability, mergeThenSelectAvailability } from '../../redux/actions/selectedAvailability';
import Availability, { AvailabilityType, AvailabilityArgs, roundUpAvailability } from '../../types/Availability';
import AvailabilityCard from './AvailabilityCard/AvailabilityCard';
import HoveredTime from './HoveredTime/HoveredTime';
import { FIRST_HOUR, LAST_HOUR, formatTime } from '../../timeUtil';

const Schedule: React.FC = () => {
  // these must be unique because of how they're used below
  const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F'];

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
  const [time1, _setTime1] = React.useState(null);

  // state management for time display
  const [hoveredDay, setHoveredDay] = React.useState(null);
  const [mouseY, setMouseY] = React.useState<number>(null);
  const [hoveredTime, setHoveredTime] = React.useState<number>(null);
  const [showTimeDisplay, setShowTimeDisplay] = React.useState(true);

  const setTime1 = (newVal: number): void => {
    _setTime1(newVal);
    setShowTimeDisplay(!newVal);
  };

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

  /**
   * Records the start day and start time of where the user began clicking/dragging and
   * stores as `startDay` and `time1`, respectively
   * @param evt MouseEvent used to calculate time
   * @param idx index of the day that was clicked, starting from 0 = Monday
   */
  function handleMouseDown(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, idx: number): void {
    // ignores everything except left mouse button
    if (evt.button !== 0) return;

    setStartDay(idx);
    const newTime1 = eventToTime(evt);
    setTime1(newTime1);
  }


  /**
   * If an availability is currently being dragged, updates the currently dragged availability one
   * last time before merging it and finally de-selecting it for dragging. If no availability is
   * being dragged, simply creates an availability. In either case, the availability is rounded up
   * to at least 30 minutes.
   * @param evt
   */
  function handleMouseUp(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    // ignores everything except left mouse button
    if (evt.button !== 0) return;

    // stop dragging an availability
    if (selectedAvailability) {
      roundUpAvailability({
        ...selectedAvailability,
        time2: eventToTime(evt),
      }).map((av) => dispatch(updateAvailability(av)));
      dispatch(mergeAvailability());
      dispatch(setSelectedAvailability(null));
      setTime1(null);
      setStartDay(null);
      return;
    }

    const time2 = eventToTime(evt);
    roundUpAvailability({
      dayOfWeek: startDay,
      available: availabilityMode,
      time1,
      time2,
    }).map((av) => dispatch(addAvailability(av)));


    setTime1(null);
    setStartDay(null);
  }

  /**
   * Checks if the mouse has left the bounds of the calendar based on the given MouseEvent evt,
   * and if so, hides the time cursor and finalizes the currently dragged availability. Returns
   * true if the mouse has left the bounds of the calendar.
   * @param evt
   */
  function handleMouseLeaveCalendarBounds(
    evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): boolean {
    let time2 = null;
    if (evt.clientY < evt.currentTarget.getBoundingClientRect().top) {
      time2 = 8 * 60 + 0;
    } else if (evt.clientY > evt.currentTarget.getBoundingClientRect().bottom) {
      time2 = 21 * 60 + 0;
    } else {
      return false;
    }
    setHoveredDay(null);
    setHoveredTime(null);
    setMouseY(null);

    // stop dragging an availability
    if (selectedAvailability) {
      roundUpAvailability({
        ...selectedAvailability,
        time2,
      }).map((av) => dispatch(updateAvailability(av)));
      dispatch(mergeAvailability());
      dispatch(setSelectedAvailability(null));
      setTime1(null);
      setStartDay(null);
    }
    return true;
  }

  /**
   * As the mouse moves, this function updates `hoveredDay`, `hoveredTime`, and `mouseY` to update
   * the position of the `<HoveredTime />` component, or alternatively, if the mouse has moved
   * before 8 AM or after 9 PM, then the `<HoveredTime />` is hidden. Then, if the mouse is pressed
   * down, this function will also create/update an availability corresponding to where the user
   * is dragging
   * @param evt
   */
  function handleMouseMove(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const time2 = eventToTime(evt);
    // regardless of whether mouse is down, update position of time display
    setMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);

    if (handleMouseLeaveCalendarBounds(evt)) {
      return;
    }

    setHoveredTime(time2);

    // Only add an availability if the mouse has been pressed down
    if (time1) {
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
        dispatch(mergeThenSelectAvailability({
          dayOfWeek: startDay,
          available: availabilityMode,
          time1,
          time2,
        }));
      }
    }
  }

  /**
   * Moves the `<HoveredTime />` component into the proper calendar day by setting `hoveredDay`,
   * `hoveredTime`, and `mouseY`
   * @param evt
   * @param day index of the day that the mouse is now hovering over, where 0 = Monday
   */
  function handleMouseEnter(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, day: number): void {
    setHoveredDay(day);
    setMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
    setHoveredTime(eventToTime(evt));
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
    // meetingDays = MTWRFSU
    // day = MTWRF
    return schedule.filter((meeting) => meeting.meetingDays[day]);
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
        key={`${formatTime(availability.startTimeHours, availability.startTimeMinutes, true)}
        - ${formatTime(availability.endTimeHours, availability.endTimeMinutes, true)}`}
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

  const FULL_WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const scheduleDays = DAYS_OF_WEEK.map((day, idx) => (
    <div
      className={styles.calendarDay}
      key={day}
      onMouseDown={(evt): void => handleMouseDown(evt, idx)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={(evt): void => handleMouseEnter(evt, idx)}
      onMouseLeave={handleMouseLeaveCalendarBounds}
      role="gridcell"
      tabIndex={0}
      aria-label={FULL_WEEK_DAYS[idx]}
    >
      { meetingsForDays[idx] }
      { availabilitiesForDays[idx] }
      {
        // render time display
        hoveredDay === idx && showTimeDisplay
          ? <HoveredTime mouseY={mouseY} time={hoveredTime} />
          : null
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
