/**
 * Exports a combined reducer for the complete state of the app
 */
import { combineReducers } from 'redux';
import availability from './availability';
import availabilityMode from './availabilityMode';
import meetings from './meetings';
import courseCards from './courseCards';
import selectedAvailability from './selectedAvailability';

const autoSchedulerReducer = combineReducers({
  meetings,
  courseCards,
  availabilityMode,
  availability,
  selectedAvailability,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
