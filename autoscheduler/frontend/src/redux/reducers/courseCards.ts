/**
 * Stores all course cards that the user uses to select courses to include
 * in generated schedules
 */
import {
  CourseCardOptions, CourseCardArray, CustomizationLevel, SectionFilter, SortType,
} from '../../types/CourseCardOptions';

// action type strings
export const ADD_COURSE_CARD = 'ADD_COURSE_CARD';
export const REMOVE_COURSE_CARD = 'REMOVE_COURSE_CARD';
export const UPDATE_COURSE_CARD = 'UPDATE_COURSE_CARD';
export const CLEAR_COURSE_CARDS = 'CLEAR_COURSE_CARDS';
export const UPDATE_SORT_TYPE_COURSE_CARD = 'UPDATE_SORT_TYPE_COURSE_CARD';

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
export interface UpdateSortTypeAction {
  type: 'UPDATE_SORT_TYPE_COURSE_CARD';
  index: number;
  sortType: SortType;
}
export type CourseCardAction = AddCourseAction | RemoveCourseAction | UpdateCourseAction
| ClearCourseCardsAction | UpdateSortTypeAction;

// initial state for courseCards
// if no courses are saved for the term, an intial course card will be added
const initialCourseCardArray: CourseCardArray = {
  numCardsCreated: 1,
  0: {
    course: '',
    customizationLevel: CustomizationLevel.BASIC,
    remote: SectionFilter.NO_PREFERENCE,
    honors: SectionFilter.EXCLUDE,
    asynchronous: SectionFilter.NO_PREFERENCE,
    sections: [],
    loading: true,
    collapsed: false,
  },
};

/**
 * Function that clones state, setting the expanded card to the one at [indexToExpand]
 * @param state: Initial state
 * @param indexToExpand: Index of the card to expand
 * @param courseCardUpdates: Other props to change on the expanded card
 */
function getStateAfterExpanding(
  state: CourseCardArray,
  indexToExpand: number,
  courseCardUpdates: CourseCardOptions,
): CourseCardArray {
  // Determine new number of cards created
  const numCardsCreated = Math.max(state.numCardsCreated, indexToExpand + 1);

  const newState: CourseCardArray = { numCardsCreated };

  for (let i = 0; i < numCardsCreated; i++) {
    if (state[i] || i === indexToExpand) {
      const shouldExpand = i === indexToExpand;

      let sortedSections = {};
      if (shouldExpand && (courseCardUpdates.customizationLevel ?? state[i].customizationLevel) === CustomizationLevel.SECTION) {
        sortedSections = {
          sections: state[i].sections.sort((a, b) => {
            const sortType = courseCardUpdates.sortType ?? state[i].sortType;

            // console.log(`Inside sort, sortType: ${sortType}`);

            // sort by sect num by default
            let result = 0;
            if (sortType === SortType.GRADE) {
              result = (b.section.grades ? b.section.grades.gpa : 0)
                    - (a.section.grades ? a.section.grades.gpa : 0);
            } else if (sortType === SortType.INSTRUCTOR) {
              result = a.section.instructor.name.localeCompare(b.section.instructor.name);
            } else if (sortType === SortType.OPEN_SEATS) {
              result = a.section.currentEnrollment - b.section.currentEnrollment;
            }
            // we want sections which are the same to be sorted by section num
            if (result === 0) {
              return a.section.sectionNum.localeCompare(b.section.sectionNum);
            }
            // console.log(`Sort returning ${result}`);
            return result;
          }),
        };
      }

      newState[i] = {
        ...state[i],
        ...(shouldExpand ? courseCardUpdates : {}),
        ...sortedSections,
        collapsed: !shouldExpand,
      };

      // sort sections in section select
      //  only need to sort expanded section
      // if (shouldExpand && newState[i].customizationLevel === CustomizationLevel.SECTION) {
      //   console.log('Inside if');
      //   newState[i].sections = newState[i].sections.sort((a, b) => {
      //     const { sortType } = newState[i];

      //     console.log(`Inside sort, sortType: ${sortType}`);

      //     // sort by sect num by default
      //     let result = 0;
      //     if (sortType === SortType.GRADE) {
      //       result = (a.section.grades ? a.section.grades.gpa : 0)
      //                   - (b.section.grades ? b.section.grades.gpa : 0);
      //     } else if (sortType === SortType.INSTRUCTOR) {
      //       result = a.section.instructor.name.localeCompare(b.section.instructor.name);
      //     } else if (sortType === SortType.OPEN_SEATS) {
      //       result = a.section.currentEnrollment - b.section.currentEnrollment;
      //     }
      //     // we want sections which are the same to be sorted by section num
      //     if (result === 0) {
      //       return a.section.sectionNum.localeCompare(b.section.sectionNum);
      //     }
      //     console.log(`Sort returning ${result}`);
      //     return result;
      //   });
      // }
    }
  }
  console.log('End expand()');

  return newState;
}

// reducer
export default function courseCards(
  state: CourseCardArray = initialCourseCardArray, action: CourseCardAction,
): CourseCardArray {
  switch (action.type) {
    case ADD_COURSE_CARD: {
      const newCardIdx = action.idx ?? state.numCardsCreated;
      // If new card is explicitly expanded, perform necessary state changes
      if (action.courseCard.collapsed === false) {
        return getStateAfterExpanding(state, newCardIdx, action.courseCard);
      }
      // New card isn't supposed to be expanded, simply add it
      return {
        ...state,
        [newCardIdx]: action.courseCard,
        numCardsCreated: Math.max(state.numCardsCreated, newCardIdx + 1),
      };
    }
    case REMOVE_COURSE_CARD: {
      // Delete desired card
      let newState: CourseCardArray = state;

      // If the deleted card was expanded, expand the one below it
      const wasExpanded = state[action.index].collapsed === false;
      if (wasExpanded) {
        let newExpandedIdx: number;
        for (let i = action.index - 1; i >= 0; i--) {
          if (state[i]) {
            newExpandedIdx = i;
            break;
          }
        }
        // If no cards were below the deleted card, expand the card above it
        if (newExpandedIdx === undefined) {
          for (let i = action.index + 1; i <= state.numCardsCreated; i++) {
            if (state[i]) {
              newExpandedIdx = i;
              break;
            }
          }
        }
        if (newExpandedIdx !== undefined) {
          newState = getStateAfterExpanding(state, newExpandedIdx, undefined);
        }
      }
      newState = { ...newState, [action.index]: undefined };
      return newState;
    }
    case UPDATE_COURSE_CARD:
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
    case CLEAR_COURSE_CARDS:
      return initialCourseCardArray;
    case UPDATE_SORT_TYPE_COURSE_CARD:
      console.log('Dispatch success');
      return getStateAfterExpanding(state, action.index, { sortType: action.sortType });
    default:
      return state;
  }
}
