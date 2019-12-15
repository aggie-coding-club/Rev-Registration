import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';
import SelectTerm from '../components/LandingPage/SelectTerm';

test('Menu is closed initially', () => {
  render(<SelectTerm />);

  expect(document.getElementsByClassName('MuiPopover-root')[0]).toHaveAttribute('aria-hidden');
});

test('Menu opens after button is clicked', () => {
  const { getByText } = render(<SelectTerm />);
  const button = getByText('Select Term');
  fireEvent.click(button);

  expect(document.getElementsByClassName('MuiPopover-root')[0]).not.toHaveAttribute('aria-hidden');
});

test('Menu closes after item is selected', () => {
  const { getByText } = render(<SelectTerm />);
  const button = getByText('Select Term');
  fireEvent.click(button);
  const testSemester = getByText('Semester 1');
  fireEvent.click(testSemester);

  expect(document.getElementsByClassName('MuiPopover-root')[0]).toHaveAttribute('aria-hidden');
});
