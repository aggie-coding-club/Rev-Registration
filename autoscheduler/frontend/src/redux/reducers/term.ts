/**
 * Stores the current term
 */

// action type string
export const SET_TERM = 'SET_TERM';

// action type interface
export interface SetTermAction {
  type: 'SET_TERM';
  term: number;
}

// reducer
export default function term(state = 0, action: SetTermAction): number {
  switch (action.type) {
    case SET_TERM:
      return action.term;
    default:
      return state;
  }
}
