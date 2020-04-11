/**
 * Exports a combined reducer for the complete state of the app
 */
import { combineReducers } from 'redux';
import availability from './reducers/availability';
import availabilityMode from './reducers/availabilityMode';
import meetings from './reducers/meetings';
import schedules from './reducers/schedules';
import courseCards from './reducers/courseCards';
import selectedAvailability from './reducers/selectedAvailability';
import selectedSchedule from './reducers/selectedSchedule';
import term from './reducers/term';

const autoSchedulerReducer = combineReducers({
  meetings,
  schedules,
  selectedSchedule,
  courseCards,
  availabilityMode,
  availability,
  selectedAvailability,
  term,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
