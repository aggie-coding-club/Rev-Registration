import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
      const { getAllByDisplayValue, getByLabelText } = render(
        <Provider store={store}>
          <ProfessorGroup courseCardId={0} sectionRange={[0, 2]} />
        </Provider>,
      );

      // act
      fireEvent.click(getByLabelText('Select all for professor'));

      // assert
      // both individual sections and the header should be selected
      expect(getAllByDisplayValue('on')).toHaveLength(2);
      expect(getAllByDisplayValue('professor on')).toHaveLength(1);
    });
  });

  describe('de-selects all sections', () => {
    test('if there is initially a selected section', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      store.dispatch(setTerm('201931'));
      // make a course card with 2 sections with the same professor
      store.dispatch<any>(updateCourseCard(0, makeCourseCard({ id: 1 }, { id: 2 })));
      store.dispatch<any>(toggleSelected(0, 0));
      const { getAllByDisplayValue, getByLabelText } = render(
        <Provider store={store}>
          <ProfessorGroup
            courseCardId={0}
            sectionRange={[0, 2]}
          />
        </Provider>,
      );

      // act
      userEvent.click(getByLabelText('Select all for professor'));

      // assert
      // both individual sections and the header should be selected
      expect(getAllByDisplayValue('off')).toHaveLength(2);
      expect(getAllByDisplayValue('professor off')).toHaveLength(1);
    });
  });
});
