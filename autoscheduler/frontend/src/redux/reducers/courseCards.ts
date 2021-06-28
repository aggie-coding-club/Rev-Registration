/**
 * Stores all course cards that the user uses to select courses to include
 * in generated schedules
 */
import {
  CourseCardOptions, CourseCardArray, CustomizationLevel, SectionFilter, SortType,
  SectionSelected, DefaultSortTypeDirections,
} from '../../types/CourseCardOptions';
import { TermDataAction } from '../actions/termData';
import { SET_TERM } from './term';
import { InstructionalMethod, InstructionalMethodIntValues } from '../../types/Section';

// action type strings
export const ADD_COURSE_CARD = 'ADD_COURSE_CARD';
export const REMOVE_COURSE_CARD = 'REMOVE_COURSE_CARD';
export const UPDATE_COURSE_CARD = 'UPDATE_COURSE_CARD';
export const CLEAR_COURSE_CARDS = 'CLEAR_COURSE_CARDS';
export const UPDATE_SORT_TYPE_COURSE_CARD = 'UPDATE_SORT_TYPE_COURSE_CARD';
export const EXPAND_COURSE_CARD = 'EXPAND_COURSE_CARD';

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
    includeFull: false,
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
    sections.sort((a, b) => (a.section.sectionNum).localeCompare(b.section.sectionNum))
      .forEach((section: SectionSelected) => {
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
        case SortType.GPA:
          result = (b.section.grades ? b.section.grades.gpa : 0)
            - (a.section.grades ? a.section.grades.gpa : 0);
          break;
        case SortType.INSTRUCTOR:
          result = (a.section.instructor.name ?? '').localeCompare(b.section.instructor.name ?? '');
          break;
        case SortType.OPEN_SEATS:
          result = (b.section.maxEnrollment - b.section.currentEnrollment)
            - (a.section.maxEnrollment - a.section.currentEnrollment);
          break;
        case SortType.HONORS:
          result = (b.section.honors ? 1 : 0) - (a.section.honors ? 1 : 0);
          break;
        case SortType.INSTRUCTIONAL_METHOD:
          result = (InstructionalMethodIntValues.get(a.section.instructionalMethod)
              ?? InstructionalMethodIntValues.get(InstructionalMethod.NONE))
            - (InstructionalMethodIntValues.get(b.section.instructionalMethod)
              ?? InstructionalMethodIntValues.get(InstructionalMethod.NONE));
          break;
        default:
          break;
      }
      // we want sections which are the same to be sorted by section num
      if (result === 0) {
        return (a.section.sectionNum).localeCompare(b.section.sectionNum);
      }
      return result;
    });
  }

  if (isDescending !== DefaultSortTypeDirections.get(sortType)) {
    sortedSections.reverse();
  }
  return sortedSections;
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
      }
    }
  }
  return newState;
}

// reducer
export default function courseCards(
  state: CourseCardArray = initialCourseCardArray, action: TermDataAction, term: string,
): CourseCardArray {
  switch (action.type) {
    case ADD_COURSE_CARD: {
      // If there's a term mismatch, return the original state
      if (term !== action.term) return state;

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

      // If there's a term-mismatch, return the original state
      // Note the term is only sent in the action when there's a possiblity of a mismatch
      if (action.term && term !== action.term) return state;

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
    case SET_TERM:
      return initialCourseCardArray;
    case CLEAR_COURSE_CARDS:
      return initialCourseCardArray;
    case UPDATE_SORT_TYPE_COURSE_CARD:
      return getStateAfterExpanding(state, action.index, {
        sortType: action.sortType, sortIsDescending: action.sortIsDescending,
      });
    case EXPAND_COURSE_CARD: {
      let index = null;

      for (let i = 0; i < state.numCardsCreated; i++) {
        if (state[i]) {
          const sec1 = state[i].sections[0].section;
          const sec2 = action.section;

          // If the course is the same (only care about the first one)
          if (sec1.subject === sec2.subject && sec1.courseNum === sec2.courseNum) {
            index = i;
            break;
          }
        }
      }

      // If we couldn't find the course card, throw an Error.
      // This error will in turn display a snackbar with the error message.
      if (index === null) {
        const { subject, courseNum } = action.section;
        const firstPart = `Error: You have already removed ${subject} ${courseNum}.`;
        const secondPart = 'Add it back and try again to see this section.';
        throw Error(`${firstPart} ${secondPart}`);
      }

      const newState = getStateAfterExpanding(state, index, {
        // Always set it to section so we can scroll to it
        customizationLevel: CustomizationLevel.SECTION,
      });

      return newState;
    }
    default:
      return state;
  }
}
