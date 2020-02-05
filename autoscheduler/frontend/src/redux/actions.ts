/**
 * This file declares functions that take in the payload for an action and
 * return the action in the form that the Redux reducers need, with a string
 * type.
 */
import { ThunkAction } from 'redux-thunk';
import Meeting from '../types/Meeting';
import {
  ADD_MEETING, REMOVE_MEETING, REPLACE_MEETINGS, SingleMeetingAction, MultiMeetingAction,
  AddCourseAction, ADD_COURSE_CARD, REMOVE_COURSE_CARD, UPDATE_COURSE_CARD, RemoveCourseAction,
  UpdateCourseAction,
} from './actionTypes';
import { CourseCardOptions, SectionSelected } from '../types/CourseCardOptions';
import { RootState } from './reducers';
import fetch from './testData';

export function addMeeting(meeting: Meeting): SingleMeetingAction {
  return {
    type: ADD_MEETING,
    meeting,
  };
}

export function removeMeeting(meeting: Meeting): SingleMeetingAction {
  return {
    type: REMOVE_MEETING,
    meeting,
  };
}

/**
 * Overwrites the existing meetings with the provided ones. Use this
 * action when the user switches between potential schedules.
 * @param meetings new list of meetings to show in schedule/calendar
 */
export function replaceMeetings(meetings: Meeting[]): MultiMeetingAction {
  return {
    type: REPLACE_MEETINGS,
    meetings,
  };
}

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
