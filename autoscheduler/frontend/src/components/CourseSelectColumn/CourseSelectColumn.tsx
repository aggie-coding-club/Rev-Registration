import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import * as styles from './CourseSelectColumn.css';
import { RootState } from '../../redux/reducer';
import { CourseCardArray, CustomizationLevel } from '../../types/CourseCardOptions';
import CourseSelectCard from './CourseSelectCard/CourseSelectCard';
import { addCourseCard } from '../../redux/actions/courseCards';

/**
 * Renders a column of CourseSelectCards, as well as a button to add course cards
 */
const CourseSelectColumn: React.FC<RouteComponentProps> = () => {
  const courseCards = useSelector<RootState, CourseCardArray>(
    (state) => state.courseCards,
  );

  const dispatch = useDispatch();

  const rows: JSX.Element[] = [];

  // Add all of the course cards to rows to be displayed
  for (let i = 0; i < courseCards.numCardsCreated; i++) {
    if (courseCards[i]) {
      rows.push(
        <div
          className={styles.row}
          key={`courseSelectCardRow-${i}`}
        >
          <CourseSelectCard
            key={`courseSelectCard-${i}`}
            id={i}
          />
        </div>,
      );
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.columnWrapper}>
        <div className={styles.courseSelectColumn}>
          {rows}
        </div>
      </div>
      <Button
        color="primary"
        size="medium"
        variant="contained"
        id={styles.addCourseButton}
        onClick={(): void => {
          dispatch(addCourseCard({ customizationLevel: CustomizationLevel.BASIC, sections: [] }));
        }}
      >
        Add Course
      </Button>
    </div>
  );
};

export default CourseSelectColumn;
