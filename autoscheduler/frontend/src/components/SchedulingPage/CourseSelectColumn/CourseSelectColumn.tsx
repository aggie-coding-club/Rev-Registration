import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Cookies from 'js-cookie';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as styles from './CourseSelectColumn.css';
import * as cardStyles from './CourseSelectCard/ExpandedCourseCard/ExpandedCourseCard.css';
import * as sectionStyles from './CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionSelect.css';
import { RootState } from '../../../redux/reducer';
import { CourseCardArray, SerializedCourseCardOptions } from '../../../types/CourseCardOptions';
import CourseSelectCard from './CourseSelectCard/CourseSelectCard';
import { addCourseCard, replaceCourseCards, removeCourseCard } from '../../../redux/actions/courseCards';
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
  const [loading, setLoading] = React.useState(true);
  const [wasCourseRemoved, setCourseRemoved] = React.useState(false);

  const removeCallback = React.useCallback((id: number) => {
    dispatch(removeCourseCard(id));
    setCourseRemoved(true);
  }, [dispatch, setCourseRemoved]);

  const resetAnimations = React.useCallback(() => {
    setCourseRemoved(false);
  }, [setCourseRemoved]);

  const expandedRowRef = React.useRef<HTMLDivElement>(null);
  const MIN_CARD_HEIGHT = 500;
  // height of fixed card contents, that is, everything except section rows
  const CARD_CONTENT_BASE_HEIGHT = 217;
  const COLLAPSED_ROW_HEIGHT = 38;
  // comes from padding-top in the .row class
  const ROW_PADDING_TOP = 8;
  /**
   * Uses dynamic className to style expanded card.
   *
   * Small cards will be shown in their entirety, and large cards will be given a minimum
   * height. CSS will then show as much of the card as possible, or give the card the minimum
   * height. The sectionRows will expand to fill all available space in the card and scroll
   * so the user can see the rest of the sections. Because setting the height of sectionRows
   * in CSS makes transitions clunky, the height is calculated within this function and then
   * applied to element styles.
   */
  const fixHeight = (): void => {
    if (expandedRowRef.current) {
      // calculate the height of the expanded card
      const cardEl = expandedRowRef.current.getElementsByClassName(cardStyles.card)[0];
      const header = cardEl.getElementsByClassName(cardStyles.header)[0] as HTMLElement;
      const content = cardEl.getElementsByClassName(cardStyles.content)[0] as HTMLElement;
      const sectionRows = cardEl.getElementsByClassName(sectionStyles.sectionRows);
      // the actual height of content should include the fully expanded section rows, if present
      const deltaRowHeight = sectionRows.length > 0
        ? sectionRows[0].scrollHeight - sectionRows[0].clientHeight
        : 0;
      const expandedRowHeight = header.scrollHeight + content.scrollHeight
        + parseFloat(getComputedStyle(content).marginTop) + deltaRowHeight;

      // Apply style based on height of expanded card
      if (expandedRowHeight < MIN_CARD_HEIGHT - ROW_PADDING_TOP) {
        // Card is less than 500px, whole card should always be visible
        expandedRowRef.current.className = `${styles.row} ${styles.expandedRowSmall}`;
      } else {
        // Card is at least 500px, give it that minimum height
        expandedRowRef.current.className = `${styles.row} ${styles.expandedRow}`;
      }

      // adjust height of section rows
      if (sectionRows.length > 0) {
        const col = document.getElementById('course-select-container');
        if (col) {
          let otherKidsHeight = 0;
          for (let i = 0; i < col.children.length; i++) {
            if (col.children[i] === expandedRowRef.current) {
              // ignore own height
              // eslint-disable-next-line no-continue
              continue;
            } else if (col.children[i].classList.contains(styles.row)) {
              otherKidsHeight += COLLAPSED_ROW_HEIGHT;
            } else {
              // height of the button at the top
              otherKidsHeight += col.children[i].clientHeight;
            }
          }
          // 500 is max height for row, 217 is height of rest of expanded card other than
          // sectionRows
          const availableHeight = Math.max(MIN_CARD_HEIGHT, col.clientHeight - otherKidsHeight)
            - CARD_CONTENT_BASE_HEIGHT;
          (sectionRows[0] as HTMLDivElement).style.height = `${availableHeight}px`;
        }
      }

      // makes sure that the initial empty course card doesn't transition its minHeight
      if (loading) expandedRowRef.current.className += ` ${styles.noTransition}`;
    }
  };
  React.useLayoutEffect(fixHeight);

  // When term is changed, fetch saved courses for the new term
  React.useEffect(() => {
    if (term) {
      setLoading(true);
      fetch(`sessions/get_saved_courses?term=${term}`).then((res) => (
        res.json()
      )).catch(() => []).then((courses: SerializedCourseCardOptions[]) => {
        dispatch(replaceCourseCards(courses, term));
        setLoading(false);
      });
    }
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
            includeFull: course.includeFull,
            sections,
            collapsed: course.collapsed,
            sortType: course.sortType,
            sortIsDescending: course.sortIsDescending,
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
      // Grow this card if it is focused so that
      // it can be viewed properly on low resolutions
      const isExpandedRow = (card.collapsed === false);
      const className = `${styles.row} ${isExpandedRow ? styles.expandedRowTemp : ''}`;
      rows.push(
        <div
          className={className}
          key={`courseSelectCardRow-${i}`}
          ref={isExpandedRow ? expandedRowRef : null}
        >
          <CourseSelectCard
            key={`courseSelectCard-${i}`}
            id={i}
            collapsed={courseCards[i].collapsed}
            shouldAnimate={!loading && !wasCourseRemoved}
            removeCourseCard={removeCallback}
            resetAnimCb={resetAnimations}
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
