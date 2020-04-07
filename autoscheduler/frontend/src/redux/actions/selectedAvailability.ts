import { ThunkAction } from 'redux-thunk';
import { AvailabilityArgs } from '../../types/Availability';
import { SetSelectedAvailabilityAction, SET_SELECTED_AVAILABILITY } from '../reducers/selectedAvailability';
import { RootState } from '../reducer';
import { time1OnlyMismatch } from '../reducers/availability';

export function setSelectedAvailability(availability: AvailabilityArgs):
SetSelectedAvailabilityAction {
  return {
    type: SET_SELECTED_AVAILABILITY,
    availability,
  };
}

export function mergeThenSelectAvailability(availability: AvailabilityArgs):
ThunkAction<SetSelectedAvailabilityAction, RootState, void, SetSelectedAvailabilityAction> {
  return (dispatch, getState): SetSelectedAvailabilityAction => {
    const mergedAv = getState().availability.find((av) => !time1OnlyMismatch(av, availability));

    return dispatch(setSelectedAvailability({
      ...mergedAv,
      time1: mergedAv.startTimeHours * 60 + mergedAv.startTimeMinutes,
      time2: mergedAv.endTimeHours * 60 + mergedAv.endTimeMinutes,
    }));
  };
}
