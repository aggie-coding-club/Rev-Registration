import TermData from '../../types/TermData';
import availability, { AvailabilityAction } from './availability';
import courseCards, { CourseCardAction } from './courseCards';
import schedules, { ScheduleAction } from './schedules';
import term, { SetTermAction } from './term';

export type TermDataAction = SetTermAction | ScheduleAction | AvailabilityAction | CourseCardAction;

const initialState: TermData = {
  term: undefined,
  availability: undefined,
  courseCards: undefined,
  schedules: undefined,
};

export default function termData(state: TermData = initialState, action: TermDataAction): TermData {
  return {
    term: term(state.term, action),
    schedules: schedules(state.schedules, action),
    availability: availability(state.availability, action),
    courseCards: courseCards(state.courseCards, action),
  };
}
