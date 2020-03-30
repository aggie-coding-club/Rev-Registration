import { AvailabilityArgs } from '../../types/Availability'; import {
  AddAvailabilityAction, ADD_AVAILABILITY, DeleteAvailabilityAction, DELETE_AVAILABILITY,
  UpdateAvailabilityAction, UPDATE_AVAILABILITY, MergeAvailabilityAction, MERGE_AVAILABILITY,
} from '../reducers/availability';

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
export function mergeAvailability(): MergeAvailabilityAction {
  return {
    type: MERGE_AVAILABILITY,
  };
}
