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
 *  array of Sections
 *  @param arr The array of sections returned from the backend, such as from api/sections
 */
export function parseSections(arr: any[]): SectionSelected[] {
  const sections: SectionSelected[] = [];

  arr.forEach((sectionData) => {
    const meetings: Meeting[] = [];

    const section = new Section({
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
        startTimeHours: Number(start[0]),
        startTimeMinutes: Number(start[1]),
        endTimeHours: Number(end[0]),
        endTimeMinutes: Number(end[1]),
        // Converts string to MeetingType enum
        meetingType: MeetingType[meetingData.type as keyof typeof MeetingType],
        section,
      });

      meetings.push(meeting);
    });
    sections.push({ section, meetings, selected: false });
  });

  return sections;
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
    const [subject, courseNum] = courseCard.course.split(' ');

    fetch(`/api/sections?dept=${subject}&course_num=${courseNum}&term=${term}`)
      .then(
        (res) => res.json(),
      )
      .then(
        (arr: any[]) => parseSections(arr),
      )
      .then(
        (sections) => {
          const hasHonors = sections.some((section) => section.section.honors);
          const hasWeb = sections.some((section) => section.section.web);
          dispatch(updateCourseCardSync(index, {
            ...courseCard, sections, hasHonors, hasWeb,
          }));
        },
      )
      .catch((error) => {
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
