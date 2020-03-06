import * as React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import autoSchedulerReducer from '../redux/reducers';
import Schedule from '../components/Schedule/Schedule';

describe('Availability UI', () => {
  describe('adds availability cards', () => {
    test('with a single click', () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText, getByLabelText } = render(
        <Provider store={store}>
          <Schedule />
        </Provider>,
      );
      const mouseEventProps = {
        button: 0,
        clientY: 500,
        currentTarget: {
          clientHeight: 1000,
          getBoundingClientRect: (): any => ({ top: 0 }),
        },
      };

      // act
      const monday = getByLabelText('Monday');
      fireEvent.mouseDown(monday, mouseEventProps);
      fireEvent.mouseUp(monday, mouseEventProps);

      // assert
      expect(getByText('BUSY')).toBeInTheDocument();
    });
  });
});
