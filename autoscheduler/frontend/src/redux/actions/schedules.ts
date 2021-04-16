import { ThunkAction } from 'redux-thunk';
import * as Cookies from 'js-cookie';
import {
  ADD_SCHEDULE, REMOVE_SCHEDULE, REPLACE_SCHEDULES, SAVE_SCHEDULE, UNSAVE_SCHEDULE, RENAME_SCHEDULE,
  SET_SCHEDULES,
} from '../reducers/schedules';
import Meeting from '../../types/Meeting';
import { RootState } from '../reducer';
import { formatTime } from '../../utils/timeUtil';
import { parseAllMeetings } from './courseCards';
import { SelectScheduleAction } from '../reducers/selectedSchedule';
import selectSchedule from './selectedSchedule';
import { GenerateSchedulesResponse } from '../../types/APIResponses';
import Schedule from '../../types/Schedule';
import {
  AddScheduleAction, RemoveScheduleAction, RenameScheduleAction,
  ReplaceSchedulesAction, SaveScheduleAction, SetSchedulesAction, UnsaveScheduleAction,
} from './termData';

export function addSchedule(meetings: Meeting[]): AddScheduleAction {
  return {
    type: ADD_SCHEDULE,
    meetings,
  };
}

export function removeSchedule(index: number): RemoveScheduleAction {
  return {
    type: REMOVE_SCHEDULE,
    index,
  };
}

export function replaceSchedules(schedules: Meeting[][]): ReplaceSchedulesAction {
  return {
    type: REPLACE_SCHEDULES,
    schedules,
  };
}

export function saveSchedule(index: number): SaveScheduleAction {
  return {
    type: SAVE_SCHEDULE,
    index,
  };
}

export function unsaveSchedule(index: number): UnsaveScheduleAction {
  return {
    type: UNSAVE_SCHEDULE,
    index,
  };
}

export function renameSchedule(index: number, name: string): RenameScheduleAction {
  return {
    type: RENAME_SCHEDULE,
    index,
    name,
  };
}

export const errorGeneratingSchedulesMessage = 'There was an error generating schedules, please try again.';

/**
 * Fetches scheduler/generate. If something goes wrong or no schedules can be generated,
 * throws an error with a message indicating what happened.
*/
export function generateSchedules():
ThunkAction<Promise<void>, RootState, undefined, ReplaceSchedulesAction | SelectScheduleAction> {
  return async (dispatch, getState): Promise<void> => {
    const { courseCards, availability, term } = getState().termData;

    const checkIfEmpty = (schedules: Meeting[][]): Meeting[][] => {
      if (schedules.length === 0) throw Error('No schedules found. Try widening your criteria.');
      return schedules;
    };

    // make courses object
    const courses = [];
    for (let i = 0; i < courseCards.numCardsCreated; i++) {
      if (courseCards[i] && courseCards[i].course) {
        const courseCard = courseCards[i];

        // Iterate through the sections and only choose the ones that are selected
        const selectedSections = courseCard.sections
          .filter((sectionSel) => sectionSel.selected)
          .map((sectionSel) => sectionSel.section.sectionNum);

        const [subject, courseNum] = courseCard.course.split(' ');

        // The default option for honors and remote when the Section customization level is selected
        const filterDefault = 'no_preference';

        courses.push({
          subject,
          courseNum,
          sections: selectedSections, // Only send if "Section" customization level
          // Only send if "Basic" level
          honors: courseCard.honors ?? filterDefault,
          remote: courseCard.remote ?? filterDefault,
          asynchronous: courseCard.asynchronous ?? filterDefault,
          includeFull: courseCard.includeFull,
        });
      }
    }
    // make availabilities object
    const availabilities = availability.map((avl) => ({
      startTime: formatTime(avl.startTimeHours, avl.startTimeMinutes, true, true).replace(':', ''),
      endTime: formatTime(avl.endTimeHours, avl.endTimeMinutes, true, true).replace(':', ''),
      day: avl.dayOfWeek,
    }));

    // make request to generate schedules and update redux, will also save availabilities
    return fetch('scheduler/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body: JSON.stringify({
        term,
        courses,
        availabilities,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        // If something went wrong generating schedules, catch the error here before
        // handling messages from no schedules being generated.
        throw new Error(errorGeneratingSchedulesMessage);
      })
      .then((json) => {
        const { schedules, message }: GenerateSchedulesResponse = json;
        if (message) throw new Error(message);
        if (!schedules?.length) {
          throw new Error(errorGeneratingSchedulesMessage);
        }
        return schedules.map(parseAllMeetings);
      })
      .then(
        checkIfEmpty,
      )
      .then((schedules: Meeting[][]) => {
        dispatch(replaceSchedules(schedules));
        dispatch(selectSchedule(0));
      });
  };
}

export function setSchedules(schedules: Schedule[], term: string): SetSchedulesAction {
  return {
    type: SET_SCHEDULES,
    schedules,
    term,
  };
}
