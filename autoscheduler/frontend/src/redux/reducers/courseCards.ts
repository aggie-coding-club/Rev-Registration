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
    courseCard: CourseCardOptions;
    idx?: number;
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
// if no courses are saved for the term, an intial course card will be added
const initialCourseCardArray: CourseCardArray = {
  numCardsCreated: 1,
  0: {
    course: '',
    customizationLevel: CustomizationLevel.BASIC,
    web: 'no_preference',
    honors: 'exclude',
    sections: [],
    loading: true,
  },
};

// function that clones state, setting the expanded card to index
function getStateAfterExpanding(
  state: CourseCardArray,
  index: number,
  courseCard: CourseCardOptions,
): CourseCardArray {
  // Determine new number of cards created
  const numCardsCreated = Math.max(state.numCardsCreated, index + 1);

  const newState: CourseCardArray = { numCardsCreated };

  for (let i = 0; i < numCardsCreated; i++) {
    if (state[i] || i === index) {
      newState[i] = { ...(state[i] || courseCard), collapsed: !(i === index) };
    }
  }
  return newState;
}

// reducer
export default function courseCards(
  state: CourseCardArray = initialCourseCardArray, action: CourseCardAction,
): CourseCardArray {
  switch (action.type) {
    case ADD_COURSE_CARD: {
      const newCardIdx = action.idx ?? state.numCardsCreated;
      return getStateAfterExpanding(state, newCardIdx, action.courseCard);
    }
    case REMOVE_COURSE_CARD:
      return {
        ...state,
        [action.index]: undefined,
      };
    case UPDATE_COURSE_CARD: {
      // if card doesn't exist, don't update
      if (!state[action.index]) return state;
      // if card was expanded, collapse other cards
      if (action.courseCard.collapsed === false && state[action.index]?.collapsed !== false) {
        return getStateAfterExpanding(state, action.index, action.courseCard);
      }

      // otherwise just update this card
      return {
        ...state,
        [action.index]: { ...state[action.index], ...action.courseCard },
        numCardsCreated: Math.max(state.numCardsCreated, action.index + 1),
      };
    }
    case CLEAR_COURSE_CARDS:
      return initialCourseCardArray;
    default:
      return state;
  }
}
