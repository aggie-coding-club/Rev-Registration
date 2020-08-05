import { ThunkAction } from 'redux-thunk';
import { AvailabilityArgs, time1OnlyMismatch } from '../../types/Availability';
import {
  AddSelectedAvailabilityAction, RemoveSelectedAvailabilityAction,
  ClearSelectedAvailabilitiesAction, SelectedAvailabilityAction,
  ADD_SELECTED_AVAILABILITY, REMOVE_SELECTED_AVAILABILITY, CLEAR_SELECTED_AVAILABILITIES,
} from '../reducers/selectedAvailability';
import { RootState } from '../reducer';

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

export function mergeThenSelectAvailability(availability: AvailabilityArgs):
ThunkAction<SelectedAvailabilityAction, RootState, void, SelectedAvailabilityAction> {
  return (dispatch, getState): SelectedAvailabilityAction => {
    const mergedAv = getState().availability.find((av) => !time1OnlyMismatch(av, availability));

    return dispatch(addSelectedAvailability({
      ...mergedAv,
      time1: mergedAv.startTimeHours * 60 + mergedAv.startTimeMinutes,
      time2: mergedAv.endTimeHours * 60 + mergedAv.endTimeMinutes,
    }));
  };
}
