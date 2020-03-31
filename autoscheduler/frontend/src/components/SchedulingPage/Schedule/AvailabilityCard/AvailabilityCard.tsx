import * as React from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Availability from '../../../../types/Availability';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import * as styles from './AvailabilityCard.css';
import { deleteAvailability } from '../../../../redux/actions/availability';
import { setSelectedAvailability } from '../../../../redux/actions/selectedAvailability';
import { FIRST_HOUR, LAST_HOUR } from '../../../../timeUtil';

interface AvailabilityCardProps {
    availability: Availability;
    firstHour: number;
    lastHour: number;
}

/**
   * Given a MouseEvent in a calendar day, calculates the time, in minutes since midnight
   * and rounded to the nearest 10, at which the mouse event was
   *
   * NOTE: this function uses some custom code that applies ONLY to use with DragHandle.
   * Do NOT copy this function for use elsewhere. It will not work!
   * @param evt
   */
function eventToTime(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): number {
  const totalY = (evt.currentTarget as HTMLDivElement).parentElement.parentElement.clientHeight;
  const yPercent = (evt.clientY - 110) / totalY; // DEBUG the 110 here was measured experimentally
  const minutesPerDay = (LAST_HOUR - FIRST_HOUR) * 60;
  const yMinutes = yPercent * minutesPerDay;
  const roundedMinutes = Math.round(yMinutes / 10) * 10;
  return roundedMinutes + FIRST_HOUR * 60;
}

/**
 * Renders a block of availability on the schedule
 * @param props include availability, firstHour, lastHour
 */
const AvailabilityCard: React.FC<AvailabilityCardProps> = (
  { availability, firstHour, lastHour },
) => {
  const dispatch = useDispatch();
  const {
    available, dayOfWeek, startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  } = availability;
  const onDragHandleDown = React.useCallback(
    (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, endSelected: boolean): void => {
      const time2 = eventToTime(evt);
      const time1 = endSelected
        ? startTimeHours * 60 + startTimeMinutes
        : endTimeHours * 60 + endTimeMinutes;
      dispatch(setSelectedAvailability({
        available: availability.available,
        dayOfWeek: availability.dayOfWeek,
        time1,
        time2,
      }));
      // prevents highlighting of drag handle
      evt.preventDefault();
    }, [dispatch, startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes],
  );

  return (
    <ScheduleCard
      startTimeHours={startTimeHours}
      startTimeMinutes={startTimeMinutes}
      endTimeHours={endTimeHours}
      endTimeMinutes={endTimeMinutes}
      firstHour={firstHour}
      lastHour={lastHour}
      borderColor="red"
      backgroundColor="#f4433680"
      onDragHandleDown={onDragHandleDown}
    >
      <div className={styles.container}>
        <span style={{ color: 'black' }}>BUSY</span>
        <DeleteIcon
          htmlColor="rgba(0, 0, 0, 0.7)"
          fontSize="small"
          className={styles.icon}
          onMouseDown={(evt): void => evt.stopPropagation()}
          onClick={(evt): void => {
            dispatch(deleteAvailability({
              available,
              dayOfWeek,
              time1: startTimeHours * 60 + startTimeMinutes,
              time2: endTimeHours * 60 + endTimeMinutes,
            }));
            evt.preventDefault();
          }}
        />
      </div>
    </ScheduleCard>
  );
};

export default AvailabilityCard;
