import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import * as styles from './CourseSelectColumn.css';
import { RootState } from '../../../redux/reducer';
import { CourseCardArray, SerializedCourseCardOptions } from '../../../types/CourseCardOptions';
import CourseSelectCard from './CourseSelectCard/CourseSelectCard';
import { addCourseCard, replaceCourseCards, clearCourseCards } from '../../../redux/actions/courseCards';

/**
 * Renders a column of CourseSelectCards, as well as a button to add course cards
 */
const CourseSelectColumn: React.FC = () => {
  const courseCards = useSelector<RootState, CourseCardArray>(
    (state) => state.courseCards,
  );

  const dispatch = useDispatch();

  const term = useSelector<RootState, string>((state) => state.term);

  React.useEffect(() => {
    // When term is changed, fetch saved courses for the new term
    if (term) {
      fetch(`sessions/get_saved_courses?term=${term}`).then((res) => (
        res.json()
      )).then((courses: SerializedCourseCardOptions[]) => {
        dispatch(replaceCourseCards(courses, term));
      });
    }

    // on unmount, clear course cards
    return (): void => { dispatch(clearCourseCards()); };
  }, [term, dispatch]);

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
        <div className={styles.courseSelectColumn} id="course-select-container">
          {rows}
          <div id={styles.buttonContainer}>
            <Button
              color="primary"
              size="medium"
              variant="contained"
              id={styles.addCourseButton}
              onClick={(): void => {
                dispatch(addCourseCard());
              }}
            >
            Add Course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSelectColumn;
