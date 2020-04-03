/**
 * Stores the current term
 */

// type
export class TermType {
  term: number;
}

// action type string
export const SET_TERM = 'SET_TERM';

// action type interface
export interface SetTermAction {
  type: 'SET_TERM';
  term: TermType;
}

// reducer
export default function term(state: TermType = { term: 0 }, action: SetTermAction): TermType {
  switch (action.type) {
    case SET_TERM:
      return {
        ...state,
        term: action.term.term,
      };
    default:
      return state;
  }
}
