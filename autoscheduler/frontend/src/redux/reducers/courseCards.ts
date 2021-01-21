/**
 * Stores all course cards that the user uses to select courses to include
 * in generated schedules
 */
import {
  CourseCardOptions, CourseCardArray, CustomizationLevel, SectionFilter, SortType,
  SectionSelected, SortTypeDefaultIsDescending,
} from '../../types/CourseCardOptions';
import { InstructionalMethod, InstructionalMethodIntValues } from '../../types/Section';

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
  sortIsDescending: boolean;
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
    sortType: SortType.DEFAULT,
    sortIsDescending: true,
    sections: [],
    loading: true,
    collapsed: false,
  },
};

/**
 * Function that sorts sections
 * @param sections: the sections to be sorted
 * @param sortType: how the sections should be sorted
 */
function sortSections(
  sections: SectionSelected[], sortType: SortType, isDescending: boolean,
): SectionSelected[] {
  console.log(`--------------------------------------------------------------------------------------------\n
  --------------------------------------------------------------------------------------------\n
  Sort Sections\n
  --------------------------------------------------------------------------------------------\n
  --------------------------------------------------------------------------------------------\n`);
  let sortedSections: SectionSelected[];

  /** DEFAULT:
   *    Groups sections by professor and honors status,
   *    then sorts each group by the lowest section
   *    number in the group, with TBA sections getting sorted to the bottom.
   */
  if (sortType === undefined || sortType === SortType.DEFAULT) {
    const sectionsForProfs: Map<string, SectionSelected[]> = new Map();
    // maps maintain key insertion order,
    // so add all sections to map and remember order of professors
    const TBASections: SectionSelected[] = [];
    sections.forEach((section: SectionSelected) => {
      // H stands for honors, R stands for regular
      const instructorName = section.section.instructor.name + (section.section.honors ? 'H' : 'R');
      if (instructorName === 'TBAR') {
        TBASections.push(section);
      } else if (sectionsForProfs.has(instructorName)) {
        sectionsForProfs.get(instructorName).push(section);
      } else sectionsForProfs.set(instructorName, [section]);
    });
    sortedSections = [].concat(...sectionsForProfs.values(), ...TBASections);
  } else {
    // all other sort types
    sortedSections = sections.sort((a, b) => {
      // sort by sect num by default
      let result = 0;
      switch (sortType) {
        case SortType.GRADE:
          result = (b.section.grades ? b.section.grades.gpa : 0)
            - (a.section.grades ? a.section.grades.gpa : 0);
          break;
        case SortType.INSTRUCTOR:
          result = a.section.instructor.name.localeCompare(b.section.instructor.name);
          break;
        case SortType.OPEN_SEATS:
          result = (b.section.maxEnrollment - b.section.currentEnrollment)
            - (a.section.maxEnrollment - a.section.currentEnrollment);
          break;
        case SortType.HONORS:
          result = (b.section.honors ? 1 : 0) - (a.section.honors ? 1 : 0);
          break;
        case SortType.INSTRUCTIONAL_METHOD:
          console.log(`a: ${a.section.sectionNum}, ${InstructionalMethodIntValues.get(a.section.instructionalMethod)}  |  b: ${b.section.sectionNum}, ${InstructionalMethodIntValues.get(b.section.instructionalMethod)}`);
          result = (a.section.instructionalMethod === undefined
            ? InstructionalMethodIntValues.get(InstructionalMethod.NONE)
            : InstructionalMethodIntValues.get(a.section.instructionalMethod))
            - (b.section.instructionalMethod === undefined
              ? InstructionalMethodIntValues.get(InstructionalMethod.NONE)
              : InstructionalMethodIntValues.get(b.section.instructionalMethod));
          break;
        default:
          break;
      }
      console.log(`result: ${result}`);
      // we want sections which are the same to be sorted by section num
      if (result === 0) {
        return a.section.sectionNum.localeCompare(b.section.sectionNum);
      }
      return result;
    });
  }

  const ans = isDescending ? sortedSections : sortedSections.reverse();
  return !SortTypeDefaultIsDescending.get(sortType) ? ans.reverse() : ans;
}

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
  const numCardsCreated = Math.max(Number.isNaN(state.numCardsCreated) ? 0 : state.numCardsCreated,
    indexToExpand + 1);

  const newState: CourseCardArray = { numCardsCreated };

  for (let i = 0; i < numCardsCreated; i++) {
    if (state[i] || i === indexToExpand) {
      const shouldExpand = i === indexToExpand;

      newState[i] = {
        ...state[i],
        ...(shouldExpand ? courseCardUpdates : {}),
        collapsed: !shouldExpand,
      };

      // only sort if card is expanded and isn't blank
      if (shouldExpand && newState[i].customizationLevel === CustomizationLevel.SECTION) {
        newState[i].sections = [...sortSections(
          newState[i].sections, newState[i].sortType, newState[i].sortIsDescending,
        )];

        console.log(`End sort: i=${i}, sections=${newState[i].sections.map((val) => val.section.sectionNum)}`);
      }
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
      // sort expanded card
      if (!state[action.index].collapsed && !action.courseCard.collapsed) {
        return getStateAfterExpanding(({
          ...state,
          [action.index]: { ...state[action.index], ...action.courseCard },
          numCardsCreated: Math.max(state.numCardsCreated, action.index + 1),
        }), action.index, {});
      }
      return ({
        ...state,
        [action.index]: { ...state[action.index], ...action.courseCard },
        numCardsCreated: Math.max(state.numCardsCreated, action.index + 1),
      });
    case CLEAR_COURSE_CARDS:
      return initialCourseCardArray;
    case UPDATE_SORT_TYPE_COURSE_CARD:
      return getStateAfterExpanding(state, action.index, {
        sortType: action.sortType, sortIsDescending: action.sortIsDescending,
      });
    default:
      return state;
  }
}
