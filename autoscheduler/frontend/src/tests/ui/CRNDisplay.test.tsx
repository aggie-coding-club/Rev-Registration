import * as React from 'react';
import {
  render, fireEvent,
} from '@testing-library/react';
import CRNDisplay from '../../components/SchedulingPage/SchedulePreview/ScheduleDetails/CRNDisplay/CRNDisplay';

describe('CRNDisplay', () => {
  test('copies the correct CRN to the clipboard when clicked', () => {
    // arrange

    // Mock copy to clipboard
    const copy = jest.fn(async (text) => text);
    Object.defineProperty(window, 'navigator', {
      value: {
        clipboard: {
          writeText: copy,
        },
      },
    });

    const CRN = 12345;
    const { getByLabelText } = render(
      <CRNDisplay crn={CRN} />,
    );

    // act
    fireEvent.click(getByLabelText('Copy'));

    // assert
    expect(copy).toHaveBeenCalledWith(String(CRN));
  });
});
