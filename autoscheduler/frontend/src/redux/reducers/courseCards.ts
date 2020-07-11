/**
 * Stores all course cards that the user uses to select courses to include
 * in generated schedules
 */
import { CourseCardOptions, CourseCardArray, CustomizationLevel } from '../../types/CourseCardOptions';

// action type strings
export const ADD_COURSE_CARD = 'ADD_COURSE_CARD';
export const REMOVE_COURSE_CARD = 'REMOVE_COURSE_CARD';
export const UPDATE_COURSE_CARD = 'UPDATE_COURSE_CARD';
export const CLEAR_COURSE_CARDS = 'CLEAR_COURSE_CARDS';

// action type interfaces
export interface AddCourseAction {
    type: 'ADD_COURSE_CARD';
    courseCard?: CourseCardOptions;
}
export interface RemoveCourseAction {
    type: 'REMOVE_COURSE_CARD';
    index: number;
}
export interface UpdateCourseAction {
    type: 'UPDATE_COURSE_CARD';
    index: number;
    courseCard: CourseCardOptions;
}
export interface ClearCourseCardsAction {
  type: 'CLEAR_COURSE_CARDS';
}
export type CourseCardAction = AddCourseAction | RemoveCourseAction | UpdateCourseAction
| ClearCourseCardsAction;

// initial state for courseCards
const initialCourseCardArray: CourseCardArray = {
  numCardsCreated: 1,
  0: {
    course: '',
    customizationLevel: CustomizationLevel.BASIC,
    web: 'exclude',
    honors: 'exclude',
    sections: [],
  },
};

// reducer
export default function courseCards(
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
    case CLEAR_COURSE_CARDS:
      return { numCardsCreated: 0 };
    default:
      return state;
  }
}
