import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import ProfessorGroup from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/ProfessorGroup';
import { toggleSelected, updateCourseCard } from '../../redux/actions/courseCards';
import setTerm from '../../redux/actions/term';
import autoSchedulerReducer from '../../redux/reducer';
import { makeCourseCard } from '../util';

describe('ProfessorGroup', () => {
  describe('selects all sections', () => {
    test('if there are initially no selected sections', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      // make a course card with 2 sections with the same professor
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({ id: 1 }, { id: 2 })));
      const { getAllByDisplayValue, getByTitle } = render(
        <Provider store={store}>
          <ProfessorGroup courseCardId={0} sectionRange={[0, 2]} />
        </Provider>,
      );

      // act
      fireEvent.click(getByTitle('Select All'));

      // assert
      // both individual sections and the header should be selected
      expect(getAllByDisplayValue('on')).toHaveLength(3);
    });

    test('if there is initially a selected section', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      // make a course card with 2 sections with the same professor
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({ id: 1 }, { id: 2 })));
      store.dispatch<any>(toggleSelected(0, 0));
      const { getAllByDisplayValue, getByTitle } = render(
        <Provider store={store}>
          <ProfessorGroup
            courseCardId={0}
            sectionRange={[0, 2]}
          />
        </Provider>,
      );

      // act
      fireEvent.click(getByTitle('Select All'));

      // assert
      // both individual sections and the header should be selected
      expect(getAllByDisplayValue('on')).toHaveLength(3);
    });
  });
});
