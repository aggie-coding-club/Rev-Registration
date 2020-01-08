/**
 * Reducers in Redux are functions that take in the old state and an action
 * to apply to that state, then return the new state. All reducers go in this file.
 */
import { combineReducers } from 'redux';
import {
  MeetingAction, ADD_MEETING, REMOVE_MEETING, REPLACE_MEETINGS, CourseCardAction,
  ADD_COURSE_CARD, REMOVE_COURSE_CARD, UPDATE_COURSE_CARD,
} from './actionTypes';
import Meeting from '../types/Meeting';
import { CourseCardArray, CustomizationLevel } from '../types/CourseCardOptions';

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

// return combined reducer for entire app
const autoSchedulerReducer = combineReducers({
  meetings,
  courseCards,
});

export default autoSchedulerReducer;
export type RootState = ReturnType<typeof autoSchedulerReducer>;
