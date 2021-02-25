/**
 * Stores the current term
 */

import { TermDataAction } from '../actions/termData';

// action type string
export const SET_TERM = 'SET_TERM';

// reducer
export default function term(state = '', action: TermDataAction): string {
  switch (action.type) {
    case SET_TERM:
      return action.term;
    default:
      return state;
  }
}
