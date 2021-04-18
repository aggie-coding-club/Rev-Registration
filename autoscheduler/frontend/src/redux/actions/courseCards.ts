import { ThunkAction } from 'redux-thunk';
import {
  CourseCardOptions, SectionSelected, SerializedCourseCardOptions, SortType,
  SectionFilter,
} from '../../types/CourseCardOptions';
import {
  ADD_COURSE_CARD, REMOVE_COURSE_CARD, UPDATE_COURSE_CARD, UPDATE_SORT_TYPE_COURSE_CARD,
} from '../reducers/courseCards';
import { RootState } from '../reducer';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Grades from '../../types/Grades';
import {
  AddCourseAction, CourseCardAction, RemoveCourseAction, UpdateCourseAction, UpdateSortTypeAction,
} from './termData';
import sortMeeting from '../../utils/sortMeetingFunction';

function createEmptyCourseCard(): CourseCardOptions {
  return {
    course: '',
    sections: [],
    remote: SectionFilter.NO_PREFERENCE,
    honors: SectionFilter.EXCLUDE,
    asynchronous: SectionFilter.NO_PREFERENCE,
    includeFull: false,
    collapsed: false,
    sortType: SortType.DEFAULT,
  };
}

export function addCourseCard(
  term: string,
  courseCard = createEmptyCourseCard(),
  idx: number = undefined,
): AddCourseAction {
  return {
    type: ADD_COURSE_CARD,
    courseCard,
    idx,
    term,
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
   * @param term the current term, which defaults to undefined
   */
function updateCourseCardSync(
  index: number, courseCard: CourseCardOptions, term: string = undefined,
): UpdateCourseAction {
  return {
    type: UPDATE_COURSE_CARD,
    index,
    courseCard,
    term,
  };
}

/**
 * Helper function that converts the given serialized section from the backend and converts it
 * into a Section type
 * @param sectionData The serialized section returned from the backend, i.e. from /api/sections
 */
function parseSection(sectionData: any): Section {
  return new Section({
    id: Number(sectionData.id),
    crn: Number(sectionData.crn),
    subject: sectionData.subject,
    courseNum: sectionData.course_num,
    sectionNum: sectionData.section_num,
    minCredits: Number(sectionData.min_credits),
    maxCredits: Number(sectionData.max_credits) || null,
    currentEnrollment: Number(sectionData.current_enrollment),
    maxEnrollment: Number(sectionData.max_enrollment),
    honors: sectionData.honors,
    remote: sectionData.remote,
    asynchronous: sectionData.asynchronous,
    instructor: new Instructor({ name: sectionData.instructor_name }),
    grades: sectionData.grades == null ? null : new Grades(sectionData.grades),
    instructionalMethod: sectionData.instructional_method ?? InstructionalMethod.NONE,
  });
}

/**
 * Helper function that iterates through all of the meetings in single section given by the backend
 * and converts them into a Meeting's type array
 * @param sectionData The serialized section returned from the backend, i.e. from /api/sections
 * @param section The parsed Section type from this sectionData
 */
function parseMeetings(sectionData: any, section: Section): Meeting[] {
  return sectionData.meetings.map((meetingData: any) => {
    let start: string[] = ['0', '0'];
    let end: string[] = ['0', '0'];

    if (meetingData.start_time != null && meetingData.start_time.length > 0) {
      start = meetingData.start_time.split(':');
      end = meetingData.end_time.split(':');
    }

    const meeting = new Meeting({
      id: Number(meetingData.id),
      building: meetingData.building ?? '',
      meetingDays: meetingData.days,
      startTimeHours: Number(start[0]),
      startTimeMinutes: Number(start[1]),
      endTimeHours: Number(end[0]),
      endTimeMinutes: Number(end[1]),
      // Converts string to MeetingType enum
      meetingType: MeetingType[meetingData.type as keyof typeof MeetingType],
      section,
    });

    return meeting;
  });
}

/**
 * Helper function that iterates through all of the individual sections that are given by
 * /scheduler/generate, parses their meetings, then combines them into a singular Meeting array
 * Used in ConfigureCard for parsing the return from /scheduler/generate
 * @param arr The array of sections returne from the backend
 */
export function parseAllMeetings(arr: any[]): Meeting[] {
  const ret: Meeting[] = [];

  arr.forEach((sectionData) => {
    const section = parseSection(sectionData);

    const meetings = parseMeetings(sectionData, section);

    ret.push(...meetings);
  });

  return ret;
}

/**
 *  Helper function to parse the serialized Section model from the backend convert it into an
 *  array of Sections
 *  @param arr The array of sections returned from the backend, such as from api/sections
 */
export function parseSectionSelected(arr: any[]): SectionSelected[] {
  return arr.map((sectionData) => {
    const section = parseSection(sectionData);

    const meetings = parseMeetings(sectionData, section).sort(sortMeeting);

    return { section, meetings, selected: true };
  });
}

/**
 * Fetches sections for course in courseCard, then updates courseCard with new sections.
 * If the course card is invalid or sections can't be fetched, returns undefined.
 * @param courseCard course to get sections for
 * @param term term to fetch sections for
 */
async function fetchCourseCardFrom(
  courseCard: CourseCardOptions | SerializedCourseCardOptions,
  term: string,
): Promise<CourseCardOptions> {
  const [subject, courseNum] = courseCard.course?.split(' ') || ['', ''];
  return fetch(`/api/sections?dept=${subject}&course_num=${courseNum}&term=${term}`)
    .then((res) => res.json())
    .then(parseSectionSelected)
    .then((sections) => {
      const hasHonors = sections.some((section) => section.section.honors);
      const hasRemote = sections.some((section) => section.section.remote);
      const hasAsynchronous = sections.some((section) => section.section.asynchronous);
      // Update honors and web based on whether the old selection is still possible
      const honors = hasHonors ? courseCard.honors : SectionFilter.NO_PREFERENCE;
      const remote = hasRemote ? courseCard.remote : SectionFilter.NO_PREFERENCE;
      const asynchronous = hasAsynchronous ? courseCard.asynchronous : SectionFilter.NO_PREFERENCE;

      return {
        ...courseCard,
        sections,
        hasHonors,
        hasRemote,
        hasAsynchronous,
        honors,
        remote,
        asynchronous,
      };
    })
    .catch(() => undefined);
}

/**
   * Helper function that generates thunk-ified UpdateCourseActions after
   * fetching the new list of sections from the server
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardAsync(
  index: number, courseCard: CourseCardOptions, term: string,
): ThunkAction<Promise<void>, RootState, undefined, UpdateCourseAction> {
  return (dispatch): Promise<void> => new Promise((resolve) => {
    fetchCourseCardFrom(courseCard, term).then((updatedCourseCard) => {
      if (updatedCourseCard) {
        dispatch(updateCourseCardSync(index, updatedCourseCard, term));
        resolve();
      }
    });
  });
}

/**
   * Publicly exposed action creator that generates thunk-ified UpdateCourseActions
   * for any arbitrary change to a course card's options
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
export function updateCourseCard(index: number, courseCard: CourseCardOptions, term = ''):
    ThunkAction<void, RootState, undefined, CourseCardAction> {
  return (dispatch): void => {
    // if the course has changed, fetch new sections to display
    if (courseCard.course) {
      if (term === '') {
        throw Error('Term is empty string when passed to updateCourseCardAsync!');
      }
      dispatch(updateCourseCardSync(index, { course: courseCard.course, loading: true }));
      dispatch(updateCourseCardAsync(index, courseCard, term)).then(() => {
        dispatch(updateCourseCardSync(index, { loading: false }));
      });
    } else {
      dispatch(updateCourseCardSync(index, { ...courseCard, loading: false }));
    }
  };
}

export function toggleSelected(courseCardId: number, secIdx: number):
ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch, getState): void => {
    dispatch(updateCourseCard(courseCardId, {
      sections: getState().termData.courseCards[courseCardId].sections.map(
        (sec, idx) => (idx !== secIdx ? sec : {
          section: sec.section,
          selected: !sec.selected,
          meetings: sec.meetings,
        }),
      ),
    }));
  };
}

/**
 * Creates a thunk-ified action that changes whether or not a single section is selected
 *
 * @param courseCardId the id for the course card that the target section is on
 * @param secIdx the index of the target section
 * @param value whether to mark the section as selected or deselected
 */
export function setSelected(courseCardId: number, secIdx: number, value: boolean):
ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch, getState): void => {
    dispatch(updateCourseCard(courseCardId, {
      sections: getState().termData.courseCards[courseCardId].sections.map(
        (sec, idx) => (idx !== secIdx ? sec : {
          section: sec.section,
          selected: value,
          meetings: sec.meetings,
        }),
      ),
    }));
  };
}

/**
  This function changes every section in a course card to be either selected or deselected
  @param courseCardId is the course card the change is targeting
  @param shouldSelect decides whether to select everything or deselect everything.
   (true: select all, false: deselect all)
*/
export function toggleSelectedAll(courseCardId: number, shouldSelect: boolean):
ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch, getState): void => {
    dispatch(updateCourseCard(courseCardId, {
      sections: getState().termData.courseCards[courseCardId].sections.map(
        (sec) => ({
          section: sec.section,
          selected: shouldSelect,
          meetings: sec.meetings,
        }),
      ),
    }));
  };
}

/**
 Function to change the sort type for a particular course card,
 Distinct from updateCourseCard because update doesn't always sort
*/
export function updateSortType(
  courseCardId: number, sortType: SortType, sortIsDescending: boolean,
): UpdateSortTypeAction {
  return {
    type: UPDATE_SORT_TYPE_COURSE_CARD,
    index: courseCardId,
    sortType,
    sortIsDescending,
  };
}

/**
 * Helper function to deserialize course card, doesn't keep selected sections.
 * Also note that this sets the card as loading until its sections are retrieved.
 * @param courseCard course card to update
 * @param term term to fetch sections for
 */
function deserializeCourseCard(courseCard: SerializedCourseCardOptions): CourseCardOptions {
  return {
    course: courseCard.course,
    honors: courseCard.honors,
    remote: courseCard.remote,
    asynchronous: courseCard.asynchronous,
    includeFull: courseCard.includeFull,
    collapsed: courseCard.collapsed ?? true,
    sections: [],
    loading: true,
    sortType: courseCard.sortType,
  };
}

function getSelectedSections(
  serialized: SerializedCourseCardOptions,
  courseCard: CourseCardOptions,
): SectionSelected[] {
  const selectedSections = new Set(serialized.sections);

  // courseCard can be undefined occasionally when you change terms when it's loading
  if (!courseCard) {
    return [];
  }

  return courseCard?.sections?.map((section): SectionSelected => ({
    ...section,
    selected: selectedSections.has(section.section.id),
  })) || [];
}

/**
 * Fetches updated sections for each saved course card and replaces existing cards
 * @param courseCards Array of serialized course cards to update and replace existing cards
 * @param term Term to fetch section information from
 */
export function replaceCourseCards(
  courseCards: SerializedCourseCardOptions[],
  term: string,
): ThunkAction<void, RootState, undefined, CourseCardAction> {
  // data for sections might have changed since last visit, so create a new course card
  // for each one asynchronously and update them with data from courseCards
  return (dispatch, getState): void => {
    // if courseCards is improperly formatted or no cards are saved, simply finish loading
    if (!Array.isArray(courseCards) || courseCards.length === 0) {
      dispatch(updateCourseCardSync(0, { loading: false }));
      return;
    }

    // create course card from each serialized one, initially not fetching sections
    const deserializedCards: CourseCardOptions[] = [];
    courseCards.forEach((courseCard, idx) => {
      const deserializedCard = deserializeCourseCard(courseCard);
      deserializedCards.push(deserializedCard);
      dispatch(addCourseCard(term, deserializedCard, idx));
    });

    // all course cards are now marked as loading (preventing courses from being overwritten
    // if the page is closed), fetch sections
    deserializedCards.forEach((deserializedCard, idx) => {
      dispatch(updateCourseCardAsync(idx, deserializedCard, term)).then(() => {
        // after fetching sections, re-select sections from the serialized card and finish loading
        const updatedCard = getState().termData.courseCards[idx];
        const cardWithSectionsSelected: CourseCardOptions = {
          sections: getSelectedSections(courseCards[idx], updatedCard),
          loading: false,
        };
        dispatch(updateCourseCardSync(idx, cardWithSectionsSelected, term));
      });
    });
  };
}
