import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import * as styles from './CourseSelectColumn.css';
import { RootState } from '../../redux/reducers';
import { CourseCardArray, CustomizationLevel } from '../../types/CourseCardOptions';
import CourseSelectCard from './CourseSelectCard/CourseSelectCard';
import { addCourseCard } from '../../redux/actions';

/**
 * Renders a column of CourseSelectCards, as well as a button to add course cards
 */

const updateCourseCardPadding = (): void => {
  const container = document.getElementById('courseSelectContainer');
  const hasScrollBar = container.scrollHeight > container.clientHeight;
  const cards = Array.from(document.getElementsByClassName(styles.row) as
                           HTMLCollectionOf<HTMLElement>);
  const padding = hasScrollBar ? '2%' : '0%';
  for (let i = 0; i < cards.length; i++) {
    cards[i].style.paddingRight = padding;
  }
};

const CourseSelectColumn: React.FC<RouteComponentProps> = () => {
  const courseCards = useSelector<RootState, CourseCardArray>(
    (state) => state.courseCards,
  );

  const dispatch = useDispatch();

  const rows: JSX.Element[] = [];

  // Recalculate padding of course cards after rendering component or resizing window
  React.useEffect(() => {
    updateCourseCardPadding();
  }, [rows]);
  React.useEffect(() => {
    window.addEventListener('resize', updateCourseCardPadding);
    return (): void => window.removeEventListener('resize', updateCourseCardPadding);
  });

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
        <div className={styles.courseSelectColumn} id="courseSelectContainer">
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
