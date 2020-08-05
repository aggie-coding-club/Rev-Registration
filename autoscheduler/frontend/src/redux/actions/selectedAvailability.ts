import { ThunkAction } from 'redux-thunk';
import { AvailabilityArgs } from '../../types/Availability';
import { SetSelectedAvailabilitiesAction, SET_SELECTED_AVAILABILITIES } from '../reducers/selectedAvailability';
import { RootState } from '../reducer';
import { time1OnlyMismatch } from '../reducers/availability';

export function setSelectedAvailabilities(availabilities: AvailabilityArgs[]):
SetSelectedAvailabilitiesAction {
  return {
    type: SET_SELECTED_AVAILABILITIES,
    availabilities,
  };
}

export function mergeThenSelectAvailability(availability: AvailabilityArgs):
ThunkAction<SetSelectedAvailabilitiesAction, RootState, void, SetSelectedAvailabilitiesAction> {
  return (dispatch, getState): SetSelectedAvailabilitiesAction => {
    const mergedAv = getState().availability.find((av) => !time1OnlyMismatch(av, availability));

    return dispatch(setSelectedAvailabilities([{
      ...mergedAv,
      time1: mergedAv.startTimeHours * 60 + mergedAv.startTimeMinutes,
      time2: mergedAv.endTimeHours * 60 + mergedAv.endTimeMinutes,
    }]));
  };
}
