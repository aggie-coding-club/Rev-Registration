/**
 * Stores the currently selected availability in the schedule, so that the schedule can update
 * the appropriate availability as the user drags
 */
import { AvailabilityArgs, argsToAvailability, time1OnlyMismatch } from '../../types/Availability';

// action type string
export const ADD_SELECTED_AVAILABILITY = 'ADD_SELECTED_AVAILABILITY';
export const REMOVE_SELECTED_AVAILABILITY = 'REMOVE_SELECTED_AVAILABILITY';
export const CLEAR_SELECTED_AVAILABILITIES = 'CLEAR_SELECTED_AVAILABILITIES';

// action type interface
export interface AddSelectedAvailabilityAction {
    type: 'ADD_SELECTED_AVAILABILITY';
    availability: AvailabilityArgs;
}

export interface RemoveSelectedAvailabilityAction {
  type: 'REMOVE_SELECTED_AVAILABILITY';
  availability: AvailabilityArgs;
}

export interface ClearSelectedAvailabilitiesAction {
  type: 'CLEAR_SELECTED_AVAILABILITIES';
}

export type SelectedAvailabilityAction = AddSelectedAvailabilityAction
  | RemoveSelectedAvailabilityAction | ClearSelectedAvailabilitiesAction;

// reducer
export default function selectedAvailabilities(
  state: AvailabilityArgs[] = [], action: SelectedAvailabilityAction,
): AvailabilityArgs[] {
  switch (action.type) {
    case ADD_SELECTED_AVAILABILITY:
      return [...state, action.availability];
    case REMOVE_SELECTED_AVAILABILITY:
      return state.filter((av) => time1OnlyMismatch(argsToAvailability(av), action.availability));
    case CLEAR_SELECTED_AVAILABILITIES:
      return [];
    default:
      return state;
  }
}
