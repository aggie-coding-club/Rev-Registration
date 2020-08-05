/**
 * Stores the currently selected availability in the schedule, so that the schedule can update
 * the appropriate availability as the user drags
 */
import { AvailabilityArgs } from '../../types/Availability';

// action type string
export const SET_SELECTED_AVAILABILITIES = 'SET_SELECTED_AVAILABILITIES';

// action type interface
export interface SetSelectedAvailabilitiesAction {
    type: 'SET_SELECTED_AVAILABILITIES';
    availabilities: AvailabilityArgs[];
}

// reducer
export default function selectedAvailabilities(
  state: AvailabilityArgs[] = [], action: SetSelectedAvailabilitiesAction,
): AvailabilityArgs[] {
  if (action.type === SET_SELECTED_AVAILABILITIES) {
    return action.availabilities;
  }
  return state;
}
