import { ThunkAction } from 'redux-thunk';
import {
  CourseCardOptions, SectionSelected, CustomizationLevel, SerializedCourseCardOptions,
} from '../../types/CourseCardOptions';
import {
  AddCourseAction, ADD_COURSE_CARD, RemoveCourseAction, REMOVE_COURSE_CARD, UpdateCourseAction,
  UPDATE_COURSE_CARD,
  ClearCourseCardsAction,
  CLEAR_COURSE_CARDS,
  CourseCardAction,
} from '../reducers/courseCards';
import { RootState } from '../reducer';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Grades from '../../types/Grades';

function createEmptyCourseCard(): CourseCardOptions {
  return {
    course: '',
    customizationLevel: CustomizationLevel.BASIC,
    sections: [],
  };
}

export function addCourseCard(
  courseCard = createEmptyCourseCard(),
  idx: number = undefined,
): AddCourseAction {
  return {
    type: ADD_COURSE_CARD,
    courseCard,
    idx,
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
    web: sectionData.web,
    instructor: new Instructor({ name: sectionData.instructor_name }),
    grades: sectionData.grades == null ? null : new Grades(sectionData.grades),
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
      building: '',
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

    const meetings = parseMeetings(sectionData, section);

    return { section, meetings, selected: false };
  });
}

/**
 * Groups sections by professor and honors status, then sorts each group by the lowest section
 * number in the group, with TBA sections getting sorted to the bottom.
 * @param sections
 */
function sortSections(sections: SectionSelected[]): SectionSelected[] {
  // sort sections by sectionNum
  const sorted = sections.sort(
    (a, b) => a.section.sectionNum.localeCompare(b.section.sectionNum),
  );
  const sectionsForProfs: Map<string, SectionSelected[]> = new Map();
  // maps maintain key insertion order, so add all sections to map and remember order of professors
  const TBASections: SectionSelected[] = [];
  sorted.forEach((section) => {
    // H stands for honors, R stands for regular
    const instructorName = section.section.instructor.name + (section.section.honors ? 'H' : 'R');
    if (instructorName === 'TBAR') {
      TBASections.push(section);
    } else if (sectionsForProfs.has(instructorName)) {
      sectionsForProfs.get(instructorName).push(section);
    } else sectionsForProfs.set(instructorName, [section]);
  });
  // sections are now grouped by professor and sorted by section num
  return [].concat(...sectionsForProfs.values(), ...TBASections);
}

/**
 * Fetches sections for course in courseCard, then updates courseCard with new sections
 * @param courseCard course to get sections for
 * @param term term to fetch sections for
 */
async function fetchCourseCardFrom(
  courseCard: CourseCardOptions | SerializedCourseCardOptions,
  term: string,
): Promise<CourseCardOptions> {
  // const { course } = courseCard;
  const [subject, courseNum] = courseCard.course.split(' ');
  return fetch(`/api/sections?dept=${subject}&course_num=${courseNum}&term=${term}`)
    .then((res) => res.json())
    .then(parseSectionSelected)
    .then(sortSections)
    .then((sections) => {
      const hasHonors = sections.some((section) => section.section.honors);
      const hasWeb = sections.some((section) => section.section.web);
      return {
        ...courseCard,
        sections,
        hasHonors,
        hasWeb,
      };
    });
}

/**
   * Helper function that generates thunk-ified UpdateCourseActions after
   * fetching the new list of sections from the server
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardAsync(
  index: number, courseCard: CourseCardOptions, term: string,
): ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch): void => {
    fetchCourseCardFrom(courseCard, term).then((updatedCourseCard) => {
      dispatch(updateCourseCardSync(index, updatedCourseCard));
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  };
}

/**
   * Publicly exposed action creator that generates thunk-ified UpdateCourseActions
   * for any arbitrary change to a course card's options
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
export function updateCourseCard(index: number, courseCard: CourseCardOptions, term = ''):
    ThunkAction<UpdateCourseAction, RootState, undefined, UpdateCourseAction> {
  return (dispatch): UpdateCourseAction => {
    // if the course has changed, fetch new sections to display
    if (courseCard.course) {
      if (term === '') {
        throw Error('Term is empty string when passed to updateCourseCardAsync!');
      }
      dispatch(updateCourseCardAsync(index, courseCard, term));
    }

    // update the options in the course card
    return dispatch(updateCourseCardSync(index, courseCard));
  };
}

export function clearCourseCards(): ClearCourseCardsAction {
  return { type: CLEAR_COURSE_CARDS };
}

/**
 * Helper function to fetch updated sections for a course card and keep selected sections
 * @param courseCard course card to update
 * @param term term to fetch sections for
 */
async function updateSectionsForCourseCard(
  courseCard: SerializedCourseCardOptions,
  term: string,
): Promise<CourseCardOptions> {
  return fetchCourseCardFrom(courseCard, term).then((newCourseCard) => {
    // course is now updated with new sections, re-select sections from original courseCard


    const selectedSections = new Set(courseCard.sections);

    newCourseCard.sections.forEach((section) => {
      // eslint-disable-next-line no-param-reassign
      if (selectedSections.has(section.section.id)) section.selected = true;
    });

    return newCourseCard;
  });
}

/**
 * Creates an updated course card from courseCard by making an API call for updated
 * section information
 * @param courseCard Course card to update
 * @param term Term to fetch section information from
 */
export function replaceCourseCards(
  courseCards: SerializedCourseCardOptions[],
  term: string,
): ThunkAction<void, RootState, undefined, CourseCardAction> {
  // data for sections might have changed since last visit, so create a new course card
  // for each one asynchronously and update them with data from courseCards
  return (dispatch): void => {
    // if courseCards is improperly formatted or no cards are saved, create default
    if (!Array.isArray(courseCards) || courseCards.length === 0) {
      dispatch(addCourseCard());
      return;
    }

    // create promise for each updated course card
    const courseCardPromises = courseCards.map((card) => (updateSectionsForCourseCard(card, term)));

    // clear all course cards before adding new ones
    dispatch(clearCourseCards());

    // add empty course card if there are no course cards for the current term
    // resolve promises for each course card and add them
    courseCardPromises.forEach((courseCardPromise, idx) => {
      courseCardPromise.then((courseCard) => {
        dispatch(addCourseCard(courseCard, idx));
      });
    });
  };
}
