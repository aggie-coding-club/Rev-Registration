import { ThunkAction } from 'redux-thunk';
import { CourseCardOptions, SectionSelected } from '../../types/CourseCardOptions';
import {
  AddCourseAction, ADD_COURSE_CARD, RemoveCourseAction, REMOVE_COURSE_CARD, UpdateCourseAction,
  UPDATE_COURSE_CARD,
} from '../reducers/courseCards';
import { RootState } from '../reducer';
import Meeting, { MeetingType } from '../../types/Meeting';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';

export function addCourseCard(): AddCourseAction {
  return {
    type: ADD_COURSE_CARD,
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
 *  Helper function to parse the serialized Section model from the backend convert it into an
 *  array of Meeting types
 *  @param arr The array of sections returned from the backend, such as from api/sections
 */
export function parseMeetings(arr: any[]): Meeting[] {
  const ret: Meeting[] = [];

  arr.forEach((sectionData) => {
    const section = new Section({
      id: Number(sectionData.id),
      crn: Number(sectionData.crn),
      subject: sectionData.subject,
      courseNum: sectionData.course_num,
      sectionNum: `${sectionData.section_num}`,
      minCredits: Number(sectionData.min_credits),
      maxCredits: sectionData.max_credits == null ? null : Number(sectionData.max_credits),
      currentEnrollment: Number(sectionData.current_enrollment),
      maxEnrollment: Number(sectionData.max_enrollment),
      instructor: new Instructor({ name: sectionData.instructor_name }),
    });

    sectionData.meetings.forEach((meetingData: any) => {
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
        startTimeHours: +start[0],
        startTimeMinutes: +start[1],
        endTimeHours: +end[0],
        endTimeMinutes: +end[1],
        // Converts string to MeetingType enum
        meetingType: MeetingType[meetingData.type as keyof typeof MeetingType],
        section,
      });

      ret.push(meeting);
    });
  });

  return ret;
}

/**
 * Helper function to convert an array of meetings into an array of SectionSelected
 * objects, which package together all meetings belonging to the same section and identify
 * whether or not that section is selected
 * @param meetings
 */
function meetingsToSectionSelected(meetings: Meeting[]): SectionSelected[] {
  return meetings.sort(
    (a: Meeting, b: Meeting) => a.section.sectionNum.localeCompare(b.section.sectionNum),
    // convert Meetings to an array of SectionSelected
  ).reduce(
    (acc: SectionSelected[], curr, idx, arr) => {
      if (idx > 0 && arr[idx - 1].section.sectionNum === curr.section.sectionNum) {
        acc[acc.length - 1].meetings.push(curr);
        return acc;
      }
      return [...acc, {
        section: curr.section,
        selected: false,
        meetings: [curr],
      }];
    }, [],
  );
}

/**
   * Helper function that generates thunk-ified UpdateCourseActions after
   * fetching the new list of sections from the server
   * @param index the index of the course card to update in the CourseCardArray
   * @param courseCard the options to update
   */
function updateCourseCardAsync(
  index: number, courseCard: CourseCardOptions, term: number,
): ThunkAction<void, RootState, undefined, UpdateCourseAction> {
  return (dispatch): void => {
    const [subject, courseNum] = courseCard.course.split(' ');

    fetch(`/api/sections?dept=${subject}&course_num=${courseNum}&term=${term}`)
      .then(
        (res) => res.json(),
      )
      .then(
        (arr: any[]) => parseMeetings(arr),
      )
      .then(
        meetingsToSectionSelected,
      )
      .then(
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
export function updateCourseCard(index: number, courseCard: CourseCardOptions, term = -1):
    ThunkAction<UpdateCourseAction, RootState, undefined, UpdateCourseAction> {
  return (dispatch): UpdateCourseAction => {
    // if the course has changed, fetch new sections to display
    if (courseCard.course) {
      if (term === -1) {
        throw Error('Term is -1 when passed to updateCourseCardAsync!');
      }
      dispatch(updateCourseCardAsync(index, courseCard, term));
    }

    // update the options in the course card
    return dispatch(updateCourseCardSync(index, courseCard));
  };
}
