/**
 * Exports a combined reducer for the complete state of the app
 */
import { combineReducers } from 'redux';
import availabilityMode from './reducers/availabilityMode';
import meetings from './reducers/meetings';
import selectedAvailabilities from './reducers/selectedAvailability';
import selectedSchedule from './reducers/selectedSchedule';
import termData from './reducers/termData';
import fullscreen from './reducers/fullscreen';

const autoSchedulerReducer = combineReducers({
  termData,
  meetings,
  selectedSchedule,
  availabilityMode,
  selectedAvailabilities,
  fullscreen,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
