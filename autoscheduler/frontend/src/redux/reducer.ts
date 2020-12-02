/**
 * Exports a combined reducer for the complete state of the app
 */
import { combineReducers } from 'redux';
import availability from './reducers/availability';
import availabilityMode from './reducers/availabilityMode';
import meetings from './reducers/meetings';
import selectedAvailabilities from './reducers/selectedAvailability';
import selectedSchedule from './reducers/selectedSchedule';
import termData from './reducers/termData';

const autoSchedulerReducer = combineReducers({
  termData,
  meetings,
  selectedSchedule,
  availabilityMode,
  selectedAvailabilities,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
