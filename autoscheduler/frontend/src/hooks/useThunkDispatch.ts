import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../redux/reducer';

/**
 * Casts the return type for Redux dispatches into ThunkDispatches. The key difference
 * is that Thunk Dispatches are asynchronous, and they can be `.then`ed and `.catch`ed
 *
 * https://www.reddit.com/r/typescript/comments/c04mjt/how_to_type_reduxthunks_with_the_new_usedispatch/
 */
export default function useThunkDispatch(): ThunkDispatch<RootState, undefined, AnyAction> {
  return useDispatch();
}
