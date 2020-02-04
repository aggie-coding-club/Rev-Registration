import * as React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Availability from '../../types/Availability';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import * as styles from './AvailabilityCard.css';

interface AvailabilityCardProps {
    availability: Availability;
    firstHour: number;
    lastHour: number;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = (
  { availability, firstHour, lastHour },
) => (
  <ScheduleCard
    startTimeHours={availability.startTimeHours}
    startTimeMinutes={availability.startTimeMinutes}
    endTimeHours={availability.endTimeHours}
    endTimeMinutes={availability.endTimeMinutes}
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
      />
    </div>
  </ScheduleCard>
);

export default AvailabilityCard;
