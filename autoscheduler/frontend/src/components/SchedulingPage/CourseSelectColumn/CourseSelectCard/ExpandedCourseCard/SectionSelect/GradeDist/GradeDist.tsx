import * as React from 'react';
import { Tooltip } from '@material-ui/core';
import Grades from '../../../../../../../types/Grades';
import * as styles from './GradeDist.css';

interface GradeDistProps {
  grades: Grades;
}

const GradeDist: React.FC<GradeDistProps> = ({ grades }) => {
  const gradesTotal = grades.A + grades.B + grades.C + grades.D + grades.F + grades.I
                      + grades.Q + grades.S + grades.X;

  const colors = {
    A: '#6FCF97', // green
    B: '#56CCF2', // light blue
    C: '#F2C94C', // yellow
    D: '#F2994A', // orange
    F: '#EB5757', // red
    Q: '#9B51E0', // purple
    // Other includes: X, I, S, U
    Other: '#828282', // gray
  };

  function makeGradesRect(gradeCount: number, color: string, letter: string): JSX.Element {
    const percent = gradeCount / gradesTotal * 100;
    const tooltipText = `${letter} - ${percent.toFixed(2)}%`;

    return (
      <Tooltip
        title={tooltipText}
        arrow
        PopperProps={{
          // Fixes Tooltip scroll issue. See: https://github.com/mui-org/material-ui/issues/14366
          disablePortal: true,
        }}
      >
        <div
          style={{ width: `${percent}%`, backgroundColor: color }}
          data-testid={`${letter}-dist`}
        />
      </Tooltip>
    );
  }

  function makeFromTotalSectionsTooltipText(gradeCount: number): string {
    if (gradeCount === 1) {
      return 'From 1 total section';
    }

    return `From ${gradeCount} total sections`;
  }

  return (
    <div className={styles.gradesContainer}>
      <div className={styles.gradesDist}>
        {makeGradesRect(grades.A, colors.A, 'A')}
        {makeGradesRect(grades.B, colors.B, 'B')}
        {makeGradesRect(grades.C, colors.C, 'C')}
        {makeGradesRect(grades.D, colors.D, 'D')}
        {makeGradesRect(grades.F, colors.F, 'F')}
        {makeGradesRect(grades.Q, colors.Q, 'Q')}
        {makeGradesRect(grades.I + grades.S + grades.U + grades.X, colors.Other, 'Other')}
      </div>
      <Tooltip
        title={makeFromTotalSectionsTooltipText(grades.count)}
        arrow
        PopperProps={{
          disablePortal: true,
        }}
      >
        <div className={styles.gpaUnderline}>
          {`${grades.gpa.toFixed(2)}`}
        </div>
      </Tooltip>
    </div>
  );
};

export default GradeDist;
