import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Cookies from 'js-cookie';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as styles from './CourseSelectColumn.css';
import { RootState } from '../../../redux/reducer';
import { CourseCardArray, CustomizationLevel, SerializedCourseCardOptions } from '../../../types/CourseCardOptions';
import CourseSelectCard from './CourseSelectCard/CourseSelectCard';
import { addCourseCard, replaceCourseCards, clearCourseCards } from '../../../redux/actions/courseCards';
import createThrottleFunction from '../../../utils/createThrottleFunction';

// Creates a throttle function that shares state between calls
const throttle = createThrottleFunction();

/**
 * Renders a column of CourseSelectCards, as well as a button to add course cards
 */
const CourseSelectColumn: React.FC = () => {
  const courseCards = useSelector<RootState, CourseCardArray>(
    (state) => state.termData.courseCards,
  );
  const term = useSelector<RootState, string>((state) => state.termData.term);
  const dispatch = useDispatch();

  const expandedRowRef = React.useRef<HTMLDivElement>(null);
  // Use dynamic className to style expanded card
  React.useLayoutEffect(() => {
    if (expandedRowRef.current) {
      const expandedRowHeight = expandedRowRef.current.children[0].clientHeight;
      // Apply style based on height of expanded card
      // 500px is the min-height defined in .expanded-row, 8px is the div's padding from .row
      if (expandedRowHeight < 500 - 8) {
        // Card is less than 500px, whole card should always be visible
        expandedRowRef.current.className = `${styles.row} ${styles.expandedRowSmall}`;
      } else {
        // Card is at least 500px, give it that minimum height
        expandedRowRef.current.className = `${styles.row} ${styles.expandedRow}`;
      }
    }
  });

  // When term is changed, fetch saved courses for the new term
  React.useEffect(() => {
    if (term) {
      fetch(`sessions/get_saved_courses?term=${term}`).then((res) => (
        res.json()
      )).catch(() => []).then((courses: SerializedCourseCardOptions[]) => {
        dispatch(replaceCourseCards(courses, term));
      });
    }

    // on unmount, clear course cards
    return (): void => { dispatch(clearCourseCards()); };
  }, [term, dispatch]);

  /* When courseCards are changed, create a callback to save courses in their current state.
     The throttle function makes sure that this callback isn't run too often, and if the term
     is changed, immediately saves courses for the old term to prevent bugs when switching terms.
   */
  React.useEffect(() => {
    if (!term) return;

    // if any course cards are loading, don't try to save
    for (let i = 0; i < courseCards.numCardsCreated; i++) {
      if (courseCards[i]?.loading) return;
    }

    const saveCourses = (): void => {
      // Serialize courseCards and make API call
      const courses: SerializedCourseCardOptions[] = [];
      for (let i = 0; i < courseCards.numCardsCreated; i++) {
        const course = courseCards[i];
        if (course && course.course) {
          const sections = course.sections.filter(({ selected }) => selected).map((sectionSel) => (
            sectionSel.section.id
          ));
          courses.push({
            course: course.course,
            customizationLevel: course.customizationLevel,
            honors: course.honors,
            remote: course.remote,
            asynchronous: course.asynchronous,
            sections,
            collapsed: course.collapsed,
          });
        }
      }

      fetch('sessions/save_courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({ courses, term }),
      });
    };

    throttle(`${term}`, saveCourses, 15000, true);
  }, [courseCards, term]);

  const rows: JSX.Element[] = [];

  // Add all of the course cards to rows to be displayed
  for (let i = courseCards.numCardsCreated - 1; i >= 0; i--) {
    const card = courseCards[i];
    if (card) {
      // Grow this card if it is focused and in section view so that
      // it can be viewed properly on low resolutions
      const isExpandedRow = (card.collapsed === false
        && !card.loading
        && card.course
        && card.customizationLevel === CustomizationLevel.SECTION);
      const className = `${styles.row} ${isExpandedRow ? styles.expandedRow : ''}`;
      rows.push(
        <div
          className={className}
          key={`courseSelectCardRow-${i}`}
          ref={isExpandedRow ? expandedRowRef : null}
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
          <div id={styles.buttonContainer}>
            <Button
              color="secondary"
              size="medium"
              variant="contained"
              id={styles.addCourseButton}
              startIcon={<AddIcon />}
              onClick={(): void => {
                dispatch(addCourseCard(term));
              }}
            >
            Add Course
            </Button>
          </div>
          {rows}
        </div>
      </div>
    </div>
  );
};

export default CourseSelectColumn;
