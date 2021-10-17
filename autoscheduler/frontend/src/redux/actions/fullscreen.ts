import { SetFullscreenAction, SET_FULLSCREEN } from '../reducers/fullscreen';

export default function setFullscreen(fullscreen: boolean): SetFullscreenAction {
  return {
    type: SET_FULLSCREEN,
    fullscreen,
  };
}
