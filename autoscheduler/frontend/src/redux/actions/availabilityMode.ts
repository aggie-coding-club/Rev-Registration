import { AvailabilityType } from '../../types/Availability';
import { AvailabilityModeAction, SET_AVAILABILITY_MODE } from '../reducers/availabilityMode';

/**
 * Sets what type of availability the user is placing on the calendar. At present, the
 * user can only specify busy times during which they absolutely cannot have classes,
 * but in the future, they may also be able to add preferred times to have classes.
 * @param mode probably AvailabilityType.BUSY for now
 */
export default function setAvailabilityMode(mode: AvailabilityType): AvailabilityModeAction {
  return {
    type: SET_AVAILABILITY_MODE,
    mode,
  };
}
