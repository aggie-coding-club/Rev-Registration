import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import * as React from 'react';

import App from '../App';

test('renders without errors', () => {
  const { container } = render(<App />);
  expect(container).toBeFalsy();
});
