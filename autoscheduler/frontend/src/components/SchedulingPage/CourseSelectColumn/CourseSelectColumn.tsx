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
import useForceRender from '../../../hooks/useForceRender';


// Creates a throttle function that shares state between calls
const throttle = createThrottleFunction();

// Amount of vertical padding on each course card
const CARD_VERTICAL_PADDING = 8;
// Minimum height of the scrollable section select area on the expanded course card
const SECTION_SELECT_MIN_HEIGHT = 400;

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
  const forceRender = useForceRender();

  const removeCallback = React.useCallback((id: number) => {
    const needToDisableTransition = !courseCards[id].collapsed;
    dispatch(removeCourseCard(id));
    if (needToDisableTransition) setCourseRemoved(true);
  }, [courseCards, dispatch]);

  const resetAnimations = React.useCallback(() => {
    setCourseRemoved(false);
  }, [setCourseRemoved]);

  const expandedRowRef = React.useRef<HTMLDivElement>(null);

  /**
   * Uses dynamic className to style expanded card (the section select as well as well as
   * transitions on the card)
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
      // Determine total available space
      const col = document.getElementById('course-select-container');
      if (!col) return;
      const totalHeight = col.clientHeight;

      // Determine height of other cards
      let takenHeight = 0;
      Array.from(col.children).forEach((child) => {
        if (child !== expandedRowRef.current) takenHeight += (child as HTMLElement).scrollHeight;
      });

      // Determine height of expanded card outside of section select
      takenHeight += CARD_VERTICAL_PADDING;
      const cardClasses = [
        cardStyles.header, cardStyles.courseInput, sectionStyles.staticHeightContent,
      ];
      cardClasses.forEach((c) => {
        takenHeight += expandedRowRef.current.getElementsByClassName(c)[0].scrollHeight;
      });

      // Determine height of expanded card section select
      const sectionRows = expandedRowRef.current.getElementsByClassName(sectionStyles.sectionRows);
      if (sectionRows[0]) {
        let sectionRowHeight = 0;
        Array.from(sectionRows[0].children).forEach((section) => {
          sectionRowHeight += section.scrollHeight;
        });

        const availableHeight = Math.max(SECTION_SELECT_MIN_HEIGHT, totalHeight - takenHeight);
        const heightToUse = Math.min(availableHeight, sectionRowHeight);

        (sectionRows[0] as HTMLDivElement).style.height = `${heightToUse}px`;
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
            honors: course.honors,
            remote: course.remote,
            asynchronous: course.asynchronous,
            includeFull: course.includeFull,
            sections,
            collapsed: course.collapsed,
            sortType: course.sortType,
            sortIsDescending: course.sortIsDescending,
            disabled: course.disabled,
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
      const isExpandedRow = (card.collapsed === false
        && !card.loading
        && card.course);
      rows.push(
        <div
          className={styles.row}
          key={`courseSelectCardRow-${i}`}
          ref={isExpandedRow ? expandedRowRef : null}
        >
          <CourseSelectCard
            key={`courseSelectCard-${i}`}
            id={i}
            collapsed={courseCards[i].collapsed}
            shouldAnimate={!loading && !wasCourseRemoved}
            onHeightChange={forceRender}
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
