/**
 * This file declares functions that take in the payload for an action and
 * return the action in the form that the Redux reducers need, with a string
 * type.
 */
import { ThunkAction } from 'redux-thunk';
import { RootState } from './reducer';
import fetch from './testData';
import { CourseCardOptions, SectionSelected } from '../types/CourseCardOptions';
import { AvailabilityType, AvailabilityArgs } from '../types/Availability';
import Meeting from '../types/Meeting';

import {
  SingleMeetingAction, ADD_MEETING, REMOVE_MEETING, MultiMeetingAction, REPLACE_MEETINGS,
} from './meetings';
import {
  AddCourseAction, ADD_COURSE_CARD, RemoveCourseAction, REMOVE_COURSE_CARD, UpdateCourseAction,
  UPDATE_COURSE_CARD,
} from './courseCards';
import { AvailabilityModeAction, SET_AVAILABILITY_MODE } from './availabilityMode';
import {
  AddAvailabilityAction, ADD_AVAILABILITY, DeleteAvailabilityAction, DELETE_AVAILABILITY,
  UpdateAvailabilityAction, UPDATE_AVAILABILITY, MergeAvailabilityAction, MERGE_AVAILABILITY,
  time1OnlyMismatch,
} from './availability';
import { SetSelectedAvailabilityAction, SET_SELECTED_AVAILABILITY } from './selectedAvailability';

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

/**
 * Sets what type of availability the user is placing on the calendar. At present, the
 * user can only specify busy times during which they absolutely cannot have classes,
 * but in the future, they may also be able to add preferred times to have classes.
 * @param mode probably AvailabilityType.BUSY for now
 */
export function setAvailabilityMode(mode: AvailabilityType): AvailabilityModeAction {
  return {
    type: SET_AVAILABILITY_MODE,
    mode,
  };
}

export function addAvailability(availability: AvailabilityArgs): AddAvailabilityAction {
  return {
    type: ADD_AVAILABILITY,
    availability,
  };
}

/**
 * Deletes the availability matching the given availability args. Enter the start time
 * as `time1` and the end time as `time2`.
 * @param availability
 */
export function deleteAvailability(availability: AvailabilityArgs): DeleteAvailabilityAction {
  return {
    type: DELETE_AVAILABILITY,
    availability,
  };
}

/**
 * Updates the availability matching the given availability args. Enter the unchanged
 * time as time1 and the changed time as time2. This action should be dispatched whenever
 * an availability is updated by dragging its edges in the UI.
 * @param availability
 */
export function updateAvailability(availability: AvailabilityArgs): UpdateAvailabilityAction {
  return {
    type: UPDATE_AVAILABILITY,
    availability,
  };
}

/**
 * Merges the last-added availability with other availabilities in the Redux store
 */
export function mergeAvailability(): MergeAvailabilityAction {
  return {
    type: MERGE_AVAILABILITY,
  };
}

export function setSelectedAvailability(availability: AvailabilityArgs):
SetSelectedAvailabilityAction {
  return {
    type: SET_SELECTED_AVAILABILITY,
    availability,
  };
}

export function mergeThenSelectAvailability(availability: AvailabilityArgs):
ThunkAction<SetSelectedAvailabilityAction, RootState, void, SetSelectedAvailabilityAction> {
  return (dispatch, getState): SetSelectedAvailabilityAction => {
    const mergedAv = getState().availability.find((av) => !time1OnlyMismatch(av, availability));

    return dispatch(setSelectedAvailability({
      ...mergedAv,
      time1: mergedAv.startTimeHours * 60 + mergedAv.startTimeMinutes,
      time2: mergedAv.endTimeHours * 60 + mergedAv.endTimeMinutes,
    }));
  };
}
