/**
 * Sets whether the user is selecting busy time or not.
 * In the future, this could also support preferred times
 */
import { AvailabilityType } from '../../types/Availability';

// action type string
export const SET_AVAILABILITY_MODE = 'SET_AVAILABILITY_MODE';

// action type interface
export interface AvailabilityModeAction {
    type: 'SET_AVAILABILITY_MODE';
    mode: AvailabilityType;
}

// reducer
export default function availabilityMode(
  state: AvailabilityType = AvailabilityType.NONE, action: AvailabilityModeAction,
): AvailabilityType {
  if (action.type === SET_AVAILABILITY_MODE) { return action.mode; }
  return state;
}
