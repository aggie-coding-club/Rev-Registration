import { createStore } from 'redux';
import autoSchedulerReducer from '../../redux/reducer';
import setTerm from '../../redux/actions/term';

describe('Terms redux', () => {
  test('setTerm sets the term', () => {
    // arrange
    const store = createStore(autoSchedulerReducer);
    const term = 201931;

    // act
    store.dispatch(setTerm({ term }));

    // assert
    expect(store.getState().term.term).toEqual(term);
  });
});
