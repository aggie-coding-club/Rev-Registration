/**
 * Stores the current term
 */

import { TermDataAction } from './termData';

// action type string
export const SET_TERM = 'SET_TERM';

// action type interface
export interface SetTermAction {
  type: 'SET_TERM';
  term: string;
}

// reducer
export default function term(state = '', action: TermDataAction): string {
  switch (action.type) {
    case SET_TERM:
      return action.term;
    default:
      return state;
  }
}
