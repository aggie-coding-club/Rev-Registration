/**
 * Exports a combined reducer for the complete state of the app
 */
import { combineReducers } from 'redux';
import availability from './reducers/availability';
import availabilityMode from './reducers/availabilityMode';
import meetings from './reducers/meetings';
import courseCards from './reducers/courseCards';
import selectedAvailability from './reducers/selectedAvailability';

const autoSchedulerReducer = combineReducers({
  meetings,
  courseCards,
  availabilityMode,
  availability,
  selectedAvailability,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
