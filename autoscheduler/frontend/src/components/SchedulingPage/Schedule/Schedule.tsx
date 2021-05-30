import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Cookies from 'js-cookie';
import * as styles from './Schedule.css';
import Meeting from '../../../types/Meeting';
import MeetingCard from './MeetingCard/MeetingCard';
import { RootState } from '../../../redux/reducer';
import {
  addAvailability, updateAvailability, mergeAvailability, deleteAvailability, setAvailabilities,
} from '../../../redux/actions/availability';
import {
  clearSelectedAvailabilities, removeSelectedAvailability, addSelectedAvailability,
} from '../../../redux/actions/selectedAvailability';
import Availability, {
  AvailabilityType, AvailabilityArgs, roundUpAvailability, time1OnlyMismatch, getStart, getEnd,
} from '../../../types/Availability';
import AvailabilityCard from './AvailabilityCard/AvailabilityCard';
import HoveredTime from './HoveredTime/HoveredTime';
import { FIRST_HOUR, LAST_HOUR, formatTime } from '../../../utils/timeUtil';
import DayOfWeek from '../../../types/DayOfWeek';
import useMeetingColor from './meetingColors';
import InstructionsDialog from './InstructionsDialog/InstructionsDialog';
import createThrottleFunction from '../../../utils/createThrottleFunction';
import SmallFastProgress from '../../SmallFastProgress';
import meetingsForSchedule from '../../../utils/meetingsForSchedule';

// Creates a throttle function that shares state between calls
const throttle = createThrottleFunction();

const emptySchedule: Meeting[] = [];

const Schedule: React.FC = () => {
  // these must be unique because of how they're used below
  const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F'];

  // "props" derived from Redux store
  const schedule = useSelector<RootState, Meeting[]>(
    (state) => state.termData.schedules[state.selectedSchedule]?.meetings || emptySchedule,
  );
  const availabilityList = useSelector<RootState, Availability[]>(
    (state) => state.termData.availability,
  );
  const availabilityMode = useSelector<RootState, AvailabilityType>(
    (state) => state.availabilityMode,
  );
  const selectedAvailabilities = useSelector<RootState, AvailabilityArgs[]>(
    (state) => state.selectedAvailabilities,
  );
  // Needed for saving availabilities
  const term = useSelector<RootState, string>((state) => state.termData.term);

  const fullscreen = useSelector<RootState, boolean>((state) => state.fullscreen);

  const dispatch = useDispatch();
  const meetingColors = useMeetingColor();

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
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [isLoadingAvailabilities, setIsLoadingAvailabilities] = React.useState(true);


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
  function eventToTime(evt: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent): number {
    const meetingsContainer = document.getElementById('meetings-container');

    // never return a time that's before FIRST_HOUR or after LAST_HOUR
    if (evt.clientY < meetingsContainer.getBoundingClientRect().top) {
      return FIRST_HOUR * 60 + 0;
    } if (evt.clientY > meetingsContainer.getBoundingClientRect().bottom) {
      return LAST_HOUR * 60 + 0;
    }

    // normal calculation
    const totalY = meetingsContainer.clientHeight;
    const yPercent = (evt.clientY - meetingsContainer.getBoundingClientRect().top) / totalY;
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

    // Prevent the creation of availabilities if the saved availabilities are still loading
    if (isLoadingAvailabilities || fullscreen) {
      return;
    }

    setStartDay(idx);
    const newTime1 = eventToTime(evt);
    setTime1(newTime1);
    setIsMouseDown(true);
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

    // stop dragging selected availabilities
    if (selectedAvailabilities.length > 0) {
      setIsMouseDown(false);

      selectedAvailabilities.forEach((selectedAvailability) => roundUpAvailability({
        ...selectedAvailability,
        time2: eventToTime(evt),
      }).map((av) => dispatch(updateAvailability(av))));
      dispatch(mergeAvailability(Math.abs(hoveredDay - startDay) + 1));
      dispatch(clearSelectedAvailabilities());
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
    dispatch(mergeAvailability());

    setTime1(null);
    setStartDay(null);
  }

  /**
   * Checks if the mouse has left the bounds of the calendar based on the given MouseEvent evt,
   * and if so, hides the time cursor and adds a mouse move listener to the window. Returns true
   * if the mouse has left the bounds of the calendar.
   * @param evt
   */
  function handleMouseLeaveCalendarBounds(
    evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ): boolean {
    // time2 will be used for commiting availabilities if the mouse leaves to the top or bottom
    let time2: number = null;
    const clientRect = document.getElementById('meetings-container').getBoundingClientRect();
    if (evt.clientY < clientRect.top) {
      time2 = FIRST_HOUR * 60 + 0;
    } else if (evt.clientY > clientRect.bottom) {
      time2 = LAST_HOUR * 60 + 0;
    } else if (
      // these conditions ensure that the time disappears if the mouse leaves to the side
      evt.clientX >= clientRect.left
      && evt.clientX <= clientRect.right) {
      return false;
    }

    setHoveredDay(null);
    setHoveredTime(null);
    setMouseY(null);

    if (selectedAvailabilities.length > 0) {
      // if the mouse left to the top or bottom, stop dragging
      if (time2) {
        selectedAvailabilities.forEach((selectedAvailability) => roundUpAvailability({
          ...selectedAvailability,
          time2,
        }).map((av) => dispatch(updateAvailability(av))));
        dispatch(mergeAvailability(Math.abs(hoveredDay - startDay) + 1));
        dispatch(clearSelectedAvailabilities());
        setTime1(null);
        setStartDay(null);
      } else {
        // if the mouse leaves to the side, continue dragging via window listeners
        const myMouseMove = (ev: MouseEvent): void => {
          // if the user is dragging any availabilities, update them
          selectedAvailabilities.forEach((selectedAvailability) => dispatch(updateAvailability({
            ...selectedAvailability,
            time2: eventToTime(ev),
          })));
        };
        const release = (ev: MouseEvent): void => {
          // stop dragging availabilities
          selectedAvailabilities.forEach((selectedAvailability) => roundUpAvailability({
            ...selectedAvailability,
            time2: eventToTime(ev),
          }).map((av) => dispatch(updateAvailability(av))));
          dispatch(mergeAvailability(Math.abs(hoveredDay - startDay) + 1));
          dispatch(clearSelectedAvailabilities());
          setTime1(null);
          setStartDay(null);

          window.removeEventListener('mousemove', myMouseMove);
          window.removeEventListener('mouseup', release);
        };
        window.addEventListener('mousemove', myMouseMove);
        window.addEventListener('mouseup', release);
      }
    }
    return true;
  }

  /**
   * As the mouse moves, this function updates `hoveredDay`, `hoveredTime`, and `mouseY` to update
   * the position of the `<HoveredTime />` component, or alternatively, if the mouse has moved
   * before 8 AM or after 10 PM, then the `<HoveredTime />` is hidden. Then, if the mouse is pressed
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
      if (selectedAvailabilities.length > 0) {
        // if the user is dragging any availability, update them
        selectedAvailabilities.forEach((selectedAvailability) => dispatch(updateAvailability({
          ...selectedAvailability,
          time2,
        })));
      } else {
        // if time1 is equal to either the start or end of an existing availability,
        // treat it as if we were just dragging that availability
        const existingAv = availabilityList.find((av) => !time1OnlyMismatch(av, {
          dayOfWeek: startDay,
          available: availabilityMode,
          time1,
          time2,
        }));
        if (existingAv) {
          dispatch(addSelectedAvailability({
            ...existingAv,
            time1: getStart(existingAv) === time1 ? getEnd(existingAv) : getStart(existingAv),
            time2: getStart(existingAv) === time1 ? getStart(existingAv) : getEnd(existingAv),
          }));
          return;
        }
        // if the user is not dragging an existing availability, add a new one
        // and select it for updating
        dispatch(addAvailability({
          dayOfWeek: startDay,
          available: availabilityMode,
          time1,
          time2,
        }));
        dispatch(addSelectedAvailability({
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
    // if the user is currently dragging
    if (time1) {
      const time2 = eventToTime(evt);
      let undraggedTimeForSelectedAv = time1;
      let availabilityType = AvailabilityType.BUSY;
      if (selectedAvailabilities.length > 0) {
        undraggedTimeForSelectedAv = (selectedAvailabilities[0].time1 === time2
          ? selectedAvailabilities[0].time2 : selectedAvailabilities[0].time1);
        availabilityType = selectedAvailabilities[0].available;
      }

      selectedAvailabilities.forEach((av) => {
        dispatch(removeSelectedAvailability(av));
        dispatch(deleteAvailability(av));
      });

      const earlierDay = Math.min(startDay, day);
      const laterDay = Math.max(startDay, day);
      for (let i = earlierDay; i <= laterDay; i++) {
        const newAvArgs = {
          dayOfWeek: i,
          available: availabilityType,
          time1: undraggedTimeForSelectedAv,
          time2,
        };
        dispatch(addAvailability(newAvArgs));
        dispatch(addSelectedAvailability(newAvArgs));
      }
    }

    setHoveredDay(day);
    setMouseY(evt.clientY - evt.currentTarget.getBoundingClientRect().top);
    setHoveredTime(eventToTime(evt));
  }

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

  // let's see if useMemo reduces our render time
  const meetingsForDays = React.useMemo(() => {
    function renderMeeting(meeting: Meeting): JSX.Element {
      return (
        <MeetingCard
          meeting={meeting}
          bgColor={meetingColors.get(meeting.section.subject + meeting.section.courseNum)}
          key={meeting.id}
          firstHour={FIRST_HOUR}
          lastHour={LAST_HOUR}
          fullscreen={fullscreen}
        />
      );
    }
    return meetingsForSchedule(schedule).map(
      (meetingsForDay) => meetingsForDay.map((meeting) => renderMeeting(meeting)),
    );
  }, [meetingColors, schedule, fullscreen]);
  const availabilitiesForDays = React.useMemo(() => {
    // build each day based on availabilityList
    function getAvailabilityForDay(day: number): Availability[] {
      return availabilityList.filter((avl) => avl.dayOfWeek === day);
    }
    function renderAvailability(availability: Availability): JSX.Element {
      return (
        <AvailabilityCard
          availability={availability}
          firstHour={FIRST_HOUR}
          lastHour={LAST_HOUR}
          setShowTimeDisplay={setShowTimeDisplay}
          key={`${formatTime(availability.startTimeHours, availability.startTimeMinutes, true)}
          - ${formatTime(availability.endTimeHours, availability.endTimeMinutes, true)}`}
        />
      );
    }
    return [DayOfWeek.MON, DayOfWeek.TUE, DayOfWeek.WED, DayOfWeek.THU, DayOfWeek.FRI].map(
      (idx) => getAvailabilityForDay(idx).map((avl) => renderAvailability(avl)),
    );
  }, [availabilityList]);

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

  // When term is chagned, fetch saved availabilities for the new term
  React.useEffect(() => {
    if (term) {
      fetch(`sessions/get_saved_availabilities?term=${term}`).then(
        (res) => res.json(),
      ).then((avails: Availability[]) => {
        // We're done loading - hide the loading indicator and set the new availabilities
        dispatch(setAvailabilities(avails, term));
        setIsLoadingAvailabilities(false);
      });
    }

    // on unmount, clear availabilities
    return (): void => {
      // Should re-show the loading indicator when we change terms
      setIsLoadingAvailabilities(true);
    };
  }, [term, dispatch]);

  // Whenever we're not clicking, save availabilities every 15 seconds
  React.useEffect(() => {
    if (!term) return;

    // Only call throttle once we've stopped dragging (and thus stopped making changes) and
    // availabilities are done loading
    if (isMouseDown || isLoadingAvailabilities) return;

    // Serialize availabilities and make API call
    const saveAvailabilities = (): void => {
      fetch('sessions/save_availabilities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({ term, availabilities: availabilityList }),
      });
    };

    throttle(`${term}`, saveAvailabilities, 3000, true);
  }, [availabilityList, term, isMouseDown, isLoadingAvailabilities]);

  // On unmount, force-call the previously called throttle functions
  // This way when we navigate back to the homepage we can guarantee saveAvailabilities
  // will have been called
  React.useEffect(() => (): void => {
    throttle('', () => {}, 2 ** 31 - 1, true);
  }, []);

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        {headerTiles}
      </div>
      <div className={styles.calendarBody}>
        {hourBars}
        <div className={styles.meetingsContainer} id="meetings-container">
          {scheduleDays}
          <InstructionsDialog />
          {isLoadingAvailabilities ? (
            // Div below makes the progress indicator be in the middle of the schedule
            <div
              aria-label="availabilities-loading-indicator"
              className={styles.availabilitiesLoadingIndicator}
            >
              <SmallFastProgress size="large" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
