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

export function selectMergedAvailability(availability: AvailabilityArgs):
ThunkAction<SelectedAvailabilityAction, RootState, void, SelectedAvailabilityAction> {
  return (dispatch, getState): SelectedAvailabilityAction => {
    const mergedAv = getState().availability.find((av) => !time1OnlyMismatch(av, availability));
    const mergedStart = mergedAv.startTimeHours * 60 + mergedAv.startTimeMinutes;
    const mergedEnd = mergedAv.endTimeHours * 60 + mergedAv.endTimeMinutes;
    let time1;
    let time2;
    // if the newly merged availability preserved time1, try to keep it when
    // adding the selected availability
    if (availability.time1 === mergedStart) {
      time1 = availability.time1;
      time2 = mergedEnd;
    } else if (availability.time1 === mergedEnd) {
      time1 = availability.time1;
      time2 = mergedStart;
    } else {
      time1 = mergedStart;
      time2 = mergedEnd;
    }

    return dispatch(addSelectedAvailability({
      ...mergedAv,
      time1,
      time2,
    }));
  };
}
