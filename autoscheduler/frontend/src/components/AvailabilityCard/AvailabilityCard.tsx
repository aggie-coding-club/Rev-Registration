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

const AvailabilityCard: React.FC<AvailabilityCardProps> = (
  { availability, firstHour, lastHour },
) => {
  const dispatch = useDispatch();
  const {
    available, dayOfWeek, startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  } = availability;

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
