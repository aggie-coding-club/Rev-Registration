/**
 * Stores the currently selected availability in the schedule, so that the schedule can update
 * the appropriate availability as the user drags
 */
import { AvailabilityArgs } from '../../types/Availability';

// action type string
export const SET_SELECTED_AVAILABILITY = 'SET_SELECTED_AVAILABILITY';

// action type interface
export interface SetSelectedAvailabilityAction {
    type: 'SET_SELECTED_AVAILABILITY';
    availability: AvailabilityArgs;
}

// reducer
export default function selectedAvailability(
  state: AvailabilityArgs = null, action: SetSelectedAvailabilityAction,
): AvailabilityArgs {
  if (action.type === SET_SELECTED_AVAILABILITY) {
    return action.availability;
  }
  return state;
}
