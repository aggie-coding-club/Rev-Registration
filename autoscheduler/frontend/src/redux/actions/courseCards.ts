import { ThunkAction } from 'redux-thunk';
import fetch from '../testData';
import { CourseCardOptions, SectionSelected } from '../../types/CourseCardOptions';
import {
  AddCourseAction, ADD_COURSE_CARD, RemoveCourseAction, REMOVE_COURSE_CARD, UpdateCourseAction,
  UPDATE_COURSE_CARD,
} from '../reducers/courseCards';
import { RootState } from '../reducer';
import Meeting from '../../types/Meeting';

export function addCourseCard(courseCard: CourseCardOptions): AddCourseAction {
  return {
    type: ADD_COURSE_CARD,
    courseCard,
  };
}

export function removeCourseCard(index: number): RemoveCourseAction {
  return {
    type: REMOVE_COURSE_CARD,
    index,
  };
}

/**
   * Helper action creator that generates plain old UpdateCourseActions
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardSync(index: number, courseCard: CourseCardOptions): UpdateCourseAction {
  return {
    type: UPDATE_COURSE_CARD,
    index,
    courseCard,
  };
}

/**
   * Helper function that generates thunk-ified UpdateCourseActions after
   * fetching the new list of sections from the server
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardAsync(
  index: number, courseCard: CourseCardOptions,
): ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch): void => {
    fetch(`/api/${encodeURIComponent(courseCard.course)}/meetings`).then(
      (res) => res.json(),
      // convert Meetings to an array of SectionSelected
    ).then((meetings: Meeting[]) => meetings.sort(
      (a: Meeting, b: Meeting) => a.section.sectionNum - b.section.sectionNum,
    ).reduce((acc: SectionSelected[], curr, idx, arr) => {
      if (idx > 0 && arr[idx - 1].section.sectionNum === curr.section.sectionNum) {
        acc[acc.length - 1].meetings.push(curr);
        return acc;
      }
      return [...acc, {
        section: curr.section,
        selected: false,
        meetings: [curr],
      }];
    }, [])).then(
      (sections) => dispatch(updateCourseCardSync(index, { ...courseCard, sections })),
    );
  };
}

/**
   * Publicly exposed action creator that generates thunk-ified UpdateCourseActions
   * for any arbitrary change to a course card's options
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
export function updateCourseCard(index: number, courseCard: CourseCardOptions):
    ThunkAction<UpdateCourseAction, RootState, undefined, UpdateCourseAction> {
  return (dispatch): UpdateCourseAction => {
    // if the course has changed, fetch new sections to display
    if (courseCard.course) dispatch(updateCourseCardAsync(index, courseCard));

    // update the options in the course card
    return dispatch(updateCourseCardSync(index, courseCard));
  };
}
