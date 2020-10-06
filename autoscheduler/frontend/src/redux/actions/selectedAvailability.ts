import { AvailabilityArgs } from '../../types/Availability';
import {
  AddSelectedAvailabilityAction, RemoveSelectedAvailabilityAction,
  ClearSelectedAvailabilitiesAction,
  ADD_SELECTED_AVAILABILITY, REMOVE_SELECTED_AVAILABILITY, CLEAR_SELECTED_AVAILABILITIES,
} from '../reducers/selectedAvailability';

export function addSelectedAvailability(availability: AvailabilityArgs):
AddSelectedAvailabilityAction {
  return {
    type: ADD_SELECTED_AVAILABILITY,
    availability,
  };
}

export function removeSelectedAvailability(availability: AvailabilityArgs):
RemoveSelectedAvailabilityAction {
  return {
    type: REMOVE_SELECTED_AVAILABILITY,
    availability,
  };
}

export function clearSelectedAvailabilities(): ClearSelectedAvailabilitiesAction {
  return {
    type: CLEAR_SELECTED_AVAILABILITIES,
  };
}
