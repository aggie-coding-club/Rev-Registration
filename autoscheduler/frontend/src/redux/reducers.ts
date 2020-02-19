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
      // helper functions to get the start and end times of an availability object in minutes
      const getStart = (av: Availability): number => av.startTimeHours * 60 + av.startTimeMinutes;
      const getEnd = (av: Availability): number => av.endTimeHours * 60 + av.endTimeMinutes;

      // check for overlaps between the availability to be added and pre-existing ones
      let overlapsFound = 0; // counts merging overlaps only
      let overlapIdx = -1;

      const initNewAv = action.type === ADD_AVAILABILITY
        ? argsToAvailability(action.availability)
        : state[state.length - 1];
      let newAv = initNewAv;
      return state.reduce<Availability[]>((avsList, oldAv, idx): Availability[] => {
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
              if (overlapsFound === 2) {
                return avsList.slice(0, oldOverlapIdx)
                  .concat(avsList.slice(oldOverlapIdx + 1))
                  .concat(newAv);
              }
              return avsList.filter((av) => av !== oldAv).concat(newAv);
            }
            // if they're different types, then set the new one to the old one's borders
            // TODO
          }
        }
        // if no overlap
        return avsList.concat(oldAv);
      }, []).concat(overlapsFound ? [] : initNewAv);
    }
    case DELETE_AVAILABILITY:
      // filters the availability list for the availabiltiy matching the action args
      return state.filter((av) => av.available !== action.availability.available
        || av.dayOfWeek !== action.availability.dayOfWeek
        || av.startTimeHours * 60 + av.startTimeMinutes !== action.availability.time1
        || av.endTimeHours * 60 + av.endTimeMinutes !== action.availability.time2);
    case UPDATE_AVAILABILITY: {
      const { time1, time2 } = action.availability;
      return state.map((av) => ((av.available !== action.availability.available
        || av.dayOfWeek !== action.availability.dayOfWeek
        || (av.startTimeHours * 60 + av.startTimeMinutes !== time1
        && av.endTimeHours * 60 + av.endTimeMinutes !== time1))
        ? av
        : {
          ...av,
          startTimeHours: Math.floor(Math.min(time1, time2) / 60),
          startTimeMinutes: Math.min(time1, time2) % 60,
          endTimeHours: Math.floor(Math.max(time1, time2) / 60),
          endTimeMinutes: Math.max(time1, time2) % 60,
        }));
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
