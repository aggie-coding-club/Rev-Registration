import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import About from '../../components/LandingPage/About/About';

describe('About', () => {
  describe('is displayed', () => {
    test('when we click on the "About Rev Registration" link', async () => {
      // arrange
      const { getByText } = render(
        <About />,
      );

      // act
      const link = getByText('About Us');
      fireEvent.click(link);

      // assert
      // The only time Aggie Coding Club is shown
      expect(getByText('Aggie Coding Club')).toBeInTheDocument();
    });
  });
});
