import * as React from 'react';
import Availability from '../types/Availability';
import ScheduleCard from './ScheduleCard/ScheduleCard';

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
    backgroundColor="red"
    backgroundStripes
  >
    <span style={{ color: 'black', backgroundColor: 'white', borderRadius: 4 }}>BUSY</span>
  </ScheduleCard>
);

export default AvailabilityCard;
