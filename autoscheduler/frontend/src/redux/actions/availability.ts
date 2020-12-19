import Availability, { AvailabilityArgs } from '../../types/Availability'; import {
  ADD_AVAILABILITY, DELETE_AVAILABILITY, UPDATE_AVAILABILITY, MERGE_AVAILABILITY,
  SET_AVAILABILITIES,
  CLEAR_AVAILABILITIES,
} from '../reducers/availability';
import {
  AddAvailabilityAction, ClearAvailabilitiesAction, DeleteAvailabilityAction,
  MergeAvailabilityAction, SetAvailabilitiesAction, UpdateAvailabilityAction,
} from './termData';

export function addAvailability(availability: AvailabilityArgs): AddAvailabilityAction {
  return {
    type: ADD_AVAILABILITY,
    availability,
  };
}

/**
   * Deletes the availability matching the given availability args. Enter the start time
   * as `time1` and the end time as `time2`.
   * @param availability
   */
export function deleteAvailability(availability: AvailabilityArgs): DeleteAvailabilityAction {
  return {
    type: DELETE_AVAILABILITY,
    availability,
  };
}

/**
   * Updates the availability matching the given availability args. Enter the unchanged
   * time as time1 and the changed time as time2. This action should be dispatched whenever
   * an availability is updated by dragging its edges in the UI.
   * @param availability
   */
export function updateAvailability(availability: AvailabilityArgs): UpdateAvailabilityAction {
  return {
    type: UPDATE_AVAILABILITY,
    availability,
  };
}

/**
   * Merges the last-added availability with other availabilities in the Redux store
   */
export function mergeAvailability(numNewAvs = 1): MergeAvailabilityAction {
  return {
    type: MERGE_AVAILABILITY,
    numNewAvs,
  };
}

export function setAvailabilities(
  availabilities: Availability[], term: string,
): SetAvailabilitiesAction {
  return {
    type: SET_AVAILABILITIES,
    availabilities,
    term,
  };
}
