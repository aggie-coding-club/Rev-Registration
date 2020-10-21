import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { RootState } from '../redux/reducer';

export default function useThunkDispatch(): ThunkDispatch<RootState, undefined, AnyAction> {
  return useDispatch();
}
