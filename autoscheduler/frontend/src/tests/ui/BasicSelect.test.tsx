import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import autoSchedulerReducer from '../../redux/reducer';
import BasicSelect from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/BasicSelect/BasicSelect';
import { CustomizationLevel } from '../../types/CourseCardOptions';

describe('BasicSelect', () => {
  describe('updates the appropriate field', () => {
    test('when the user changes Honors to Only', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, {
        courseCards: {
          0: {
            course: 'MATH 151',
            customizationLevel: CustomizationLevel.BASIC,
            hasHonors: true,
            hasRemote: true,
            hasAsynchronous: true,
          },
        },
      }, applyMiddleware(thunk));
      const { queryByRole, getByLabelText, findByText } = render(
        <Provider store={store}>
          <BasicSelect id={0} />
        </Provider>,
      );

      // act
      UserEvent.click(getByLabelText('Honors:'));
      fireEvent.click(await findByText('Only'));
      await waitFor(() => { expect(queryByRole('presentation')).not.toBeInTheDocument(); });

      // assert
      expect(getByLabelText('Honors:')).toHaveTextContent('Only');
    });
    test('when the user changes Remote to Only', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, {
        courseCards: {
          0: {
            course: 'MATH 151',
            customizationLevel: CustomizationLevel.BASIC,
            hasHonors: true,
            hasRemote: true,
            hasAsynchronous: true,
          },
        },
      }, applyMiddleware(thunk));
      const { queryByRole, getByLabelText, findByText } = render(
        <Provider store={store}>
          <BasicSelect id={0} />
        </Provider>,
      );

      // act
      UserEvent.click(getByLabelText('Remote:'));
      fireEvent.click(await findByText('Only'));
      await waitFor(() => { expect(queryByRole('presentation')).not.toBeInTheDocument(); });

      // assert
      expect(getByLabelText('Remote:')).toHaveTextContent('Only');
    });
    test('when the user changes Asynchronous to Only', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer, {
        courseCards: {
          0: {
            course: 'MATH 151',
            customizationLevel: CustomizationLevel.BASIC,
            hasHonors: true,
            hasRemote: true,
            hasAsynchronous: true,
          },
        },
      }, applyMiddleware(thunk));
      const { queryByRole, getByLabelText, findByText } = render(
        <Provider store={store}>
          <BasicSelect id={0} />
        </Provider>,
      );

      // act
      UserEvent.click(getByLabelText('No Meeting Times:'));
      fireEvent.click(await findByText('Only'));
      await waitFor(() => { expect(queryByRole('presentation')).not.toBeInTheDocument(); });

      // assert
      expect(getByLabelText('No Meeting Times:')).toHaveTextContent('Only');
    });
  });
});
