/**
 * Reducers in Redux are functions that take in the old state and an action
 * to apply to that state, then return the new state. All reducers go in this file.
 */
import { combineReducers } from 'redux';
import {
  MeetingAction, ADD_MEETING, REMOVE_MEETING, REPLACE_MEETINGS,
  CourseCardAction, ADD_COURSE_CARD, REMOVE_COURSE_CARD, UPDATE_COURSE_CARD,
  AvailabilityModeAction, SET_AVAILABILITY_MODE,
  AvailabilityAction, ADD_AVAILABILITY, DELETE_AVAILABILITY, UPDATE_AVAILABILITY,
  SetSelectedAvailabilityAction, SET_SELECTED_AVAILABILITY, MERGE_AVAILABILITY,
} from './actionTypes';
import { CourseCardArray, CustomizationLevel } from '../types/CourseCardOptions';
import Meeting from '../types/Meeting';
import Availability, { AvailabilityType, argsToAvailability, AvailabilityArgs } from '../types/Availability';

/**
 * Returns the start time of an availability, in minutes past midnight
 * @param av
 */
const getStart = (av: Availability): number => av.startTimeHours * 60 + av.startTimeMinutes;
/**
 * Returns the end time of an availability, in minutes past midnight
 * @param av
 */
const getEnd = (av: Availability): number => av.endTimeHours * 60 + av.endTimeMinutes;
/**
 * Returns true if the given availability `av` disagrees from the given availability args
 * `avArgs`. If the availability types and day of weeks match, then a mismatch occurs when
 * start mismatches time1 or end mismatches time2
 * @param av
 * @param avArgs
 */
const time1And2Mismatch = (av: Availability, avArgs: AvailabilityArgs): boolean => (
  av.available !== avArgs.available
  || av.dayOfWeek !== avArgs.dayOfWeek
  || getStart(av) !== avArgs.time1
  || getEnd(av) !== avArgs.time2
);
/**
 * Returns true if the given availability `av` disagrees from the given availability args
 * `avArgs`. If the availability types and day of weeks match, then a mismatch occurs when
 * start mismatches time1 and end also mismatches time1
 * @param av
 * @param avArgs
 */
const time1OnlyMismatch = (av: Availability, avArgs: AvailabilityArgs): boolean => (
  av.available !== avArgs.available
  || av.dayOfWeek !== avArgs.dayOfWeek
  || (getStart(av) !== avArgs.time1 && getEnd(av) !== avArgs.time1)
);


// manage actions that affect meetings
function meetings(state: Meeting[] = [], action: MeetingAction): Meeting[] {
  switch (action.type) {
    case ADD_MEETING:
      return [...state, action.meeting];
    case REMOVE_MEETING:
      return state.filter((mtg: Meeting) => mtg.id !== action.meeting.id);
    case REPLACE_MEETINGS:
      return action.meetings;
    default:
      return state;
  }
}

// initial state for courseCards
const initialCourseCardArray: CourseCardArray = {
  numCardsCreated: 1,
  0: {
    course: '',
    customizationLevel: CustomizationLevel.BASIC,
    web: false,
    honors: false,
    sections: [],
  },
};
// manage actions that affect course cards
function courseCards(
  state: CourseCardArray = initialCourseCardArray, action: CourseCardAction,
): CourseCardArray {
  switch (action.type) {
    case ADD_COURSE_CARD:
      return {
        ...state,
        [state.numCardsCreated]: action.courseCard,
        numCardsCreated: state.numCardsCreated + 1,
      };
    case REMOVE_COURSE_CARD:
      return {
        ...state,
        [action.index]: undefined,
      };
    case UPDATE_COURSE_CARD:
      return {
        ...state,
        [action.index]: { ...state[action.index], ...action.courseCard },
      };
    default:
      return state;
  }
}

// sets whether the user is selecting busy time or not
// in the future, this could also support preferred times
function availabilityMode(
  state: AvailabilityType = AvailabilityType.NONE, action: AvailabilityModeAction,
): AvailabilityType {
  if (action.type === SET_AVAILABILITY_MODE) { return action.mode; }
  return state;
}

// stores all information about the user's availability
function availability(
  state: Availability[] = [], action: AvailabilityAction,
): Availability[] {
  switch (action.type) {
    case ADD_AVAILABILITY:
    case MERGE_AVAILABILITY: {
      // check for overlaps between the availability to be added and pre-existing ones
      let overlapsFound = 0; // counts merging overlaps only
      let overlapIdx = -1;

      let newAv = action.type === ADD_AVAILABILITY
        ? argsToAvailability(action.availability)
        : state[state.length - 1];
      const newState = state.reduce<Availability[]>((avsList, oldAv, idx): Availability[] => {
        // only counts as an overlap if they're on the same day of the week
        if (oldAv.dayOfWeek === newAv.dayOfWeek) {
          const avWithEarlierStart = getStart(oldAv) < getStart(newAv) ? oldAv : newAv;
          const avWithLaterStart = avWithEarlierStart === oldAv ? newAv : oldAv;
          // overlap detected
          if (getEnd(avWithEarlierStart) >= getStart(avWithLaterStart)) {
            // if they're the same type, merge them
            if (oldAv.available === newAv.available) {
              overlapsFound += 1;
              const oldOverlapIdx = overlapIdx;
              overlapIdx = idx;
              const newEnd = Math.max(getEnd(oldAv), getEnd(newAv));
              const newEndHrs = Math.floor(newEnd / 60);
              const newEndMins = newEnd % 60;
              newAv = {
                available: oldAv.available,
                dayOfWeek: oldAv.dayOfWeek,
                startTimeHours: avWithEarlierStart.startTimeHours,
                startTimeMinutes: avWithEarlierStart.startTimeMinutes,
                endTimeHours: newEndHrs,
                endTimeMinutes: newEndMins,
              };
              return avsList;
            }
            // if they're different types, then set the new one to the old one's borders
          }
        }
        // if no overlap
        avsList.push(oldAv);
        return avsList;
      }, []);
      newState.push(newAv);
      return newState;
    }
    case DELETE_AVAILABILITY:
      // filters the availability list for the availability matching the action args
      return state.filter((av) => time1And2Mismatch(av, action.availability));
    case UPDATE_AVAILABILITY: {
      const { time1, time2 } = action.availability;
      return state.map((av) => {
        // if av doesn't match the args, then leave the availability as is
        if (time1OnlyMismatch(av, action.availability)) return av;

        // if av does match args, return the updated availability
        const startTime = Math.min(time1, time2);
        const endTime = Math.max(time1, time2);
        return {
          ...av,
          startTimeHours: Math.floor(startTime / 60),
          startTimeMinutes: startTime % 60,
          endTimeHours: Math.floor(endTime / 60),
          endTimeMinutes: endTime % 60,
        };
      });
    }
    default:
      return state;
  }
}

/**
 * Stores the currently selected availability in the schedule, so that the schedule can update
 * the appropriate availability as the user drags
 * @param state The previous value of `selectedAvailability`
 * @param action The update to apply, in this case, always a `SetSelectedAvailabilityAction`
 */
function selectedAvailability(
  state: AvailabilityArgs = null, action: SetSelectedAvailabilityAction,
): AvailabilityArgs {
  if (action.type === SET_SELECTED_AVAILABILITY) {
    return action.availability;
  }
  return state;
}

// return combined reducer for entire app
const autoSchedulerReducer = combineReducers({
  meetings,
  courseCards,
  availabilityMode,
  availability,
  selectedAvailability,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
