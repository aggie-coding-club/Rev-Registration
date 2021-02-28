import TermData from '../../types/TermData';
import { TermDataAction } from '../actions/termData';
import availability from './availability';
import courseCards from './courseCards';
import schedules from './schedules';
import term from './term';

const initialState: TermData = {
  term: undefined,
  availability: undefined,
  courseCards: undefined,
  schedules: undefined,
};

export default function termData(state: TermData = initialState, action: TermDataAction): TermData {
  return {
    term: term(state.term, action),
    schedules: schedules(state.schedules, action, state.term),
    availability: availability(state.availability, action, state.term),
    courseCards: courseCards(state.courseCards, action, state.term),
  };
}
