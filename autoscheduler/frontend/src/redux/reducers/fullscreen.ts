export const SET_FULLSCREEN = 'SET_FULLSCREEN';

// action type interface
export interface SetFullscreenAction {
  type: 'SET_FULLSCREEN';
  fullscreen: boolean;
};


export default function fullscreen(
  state = false, action: SetFullscreenAction,
): boolean {
  switch (action.type) {
    case SET_FULLSCREEN:
      return action.fullscreen;
    default:
      return state;
  }
}
