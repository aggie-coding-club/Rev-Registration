import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from '../../components/App/App';
import autoSchedulerReducer from '../../redux/reducer';

test('renders without errors', () => {
  const store = createStore(autoSchedulerReducer);
  const { container } = render(<Provider store={store}><App /></Provider>);
  expect(container).toBeTruthy();
});
