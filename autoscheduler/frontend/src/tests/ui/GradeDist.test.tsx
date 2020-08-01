import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Grades from '../../types/Grades';
import GradeDist from '../../components/SchedulingPage/CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/GradeDist/GradeDist';

describe('GradeDist', () => {
  beforeAll(() => { // Fixes the document.createRange is not a function error
    const nodeProps = Object.create(Node.prototype, {});
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    document.createRange = (): Range => ({
      setStart: (): void => {},
      setEnd: (): void => {},
      commonAncestorContainer: {
        ...nodeProps,
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
  });

  describe('Shows the correct % of students that received that grade', () => {
    test('When hovering over that grade rect', async () => {
      // arrange
      const grades = new Grades({
        gpa: 3.5, A: 1, B: 1, C: 0, D: 0, F: 0, I: 0, S: 0, U: 0, Q: 0, X: 0, count: 2,
      });

      const { findByText, getByTestId } = render(
        <GradeDist grades={grades} />,
      );

      // act
      const aDist = getByTestId('A-dist');
      fireEvent.mouseEnter(aDist); // Hover over the A grade rect

      // assert
      const text = await findByText('A - 50.00%');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Shows the amount of sections used in the calculation', () => {
    test('When hovering over the overall GPA average', async () => {
      // arrange
      const count = 2;
      const grades = new Grades({
        gpa: 3.5, A: 1, B: 1, C: 0, D: 0, F: 0, I: 0, S: 0, U: 0, Q: 0, X: 0, count,
      });

      const { findByText, getByText } = render(
        <GradeDist grades={grades} />,
      );

      // act
      const gpaText = getByText('3.50');
      fireEvent.mouseEnter(gpaText); // Hover over the GPA text

      // assert
      const text = await findByText(`From ${count} total sections`);
      expect(text).toBeInTheDocument();
    });
  });
});
