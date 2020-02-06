import * as React from 'react';
import { useDispatch } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import Availability from '../../types/Availability';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import * as styles from './AvailabilityCard.css';
import { deleteAvailability } from '../../redux/actions';

interface AvailabilityCardProps {
    availability: Availability;
    firstHour: number;
    lastHour: number;
}

// TODO move this to a unified utility file
const FIRST_HOUR = 8;
const LAST_HOUR = 21;
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

const AvailabilityCard: React.FC<AvailabilityCardProps> = (
  { availability, firstHour, lastHour },
) => {
  const dispatch = useDispatch();
  const {
    available, dayOfWeek, startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  } = availability;
  const onDrag = React.useCallback((evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    eventToTime(evt); // TODO this is where I left off for the night
  }, []);

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
      onDrag={onDrag}
    >
      <div className={styles.container}>
        <span style={{ color: 'black' }}>BUSY</span>
        <DeleteIcon
          htmlColor="rgba(0, 0, 0, 0.7)"
          fontSize="small"
          className={styles.icon}
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
