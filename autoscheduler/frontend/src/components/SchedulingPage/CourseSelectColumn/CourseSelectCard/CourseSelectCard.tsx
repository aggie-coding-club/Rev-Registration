import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Delete';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, FormLabel, Card, Typography, Collapse,
} from '@material-ui/core';
import { RootState } from '../../../../redux/reducer';
import { updateCourseCard, removeCourseCard } from '../../../../redux/actions/courseCards';


import * as styles from './ExpandedCourseCard/ExpandedCourseCard.css';
import * as styles2 from '../CourseSelectColumn.css';
import SectionSelect from './ExpandedCourseCard/SectionSelect/SectionSelect';
import BasicSelect from './ExpandedCourseCard/BasicSelect/BasicSelect';
import { CustomizationLevel, CourseCardOptions } from '../../../../types/CourseCardOptions';


import SmallFastProgress from '../../../SmallFastProgress';

interface CourseSelectCardProps {
  id: number;
}

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({ id }) => {
  const courseCardOptions = useSelector<RootState, CourseCardOptions>(
    (state) => state.courseCards[id],
  );

  const term = useSelector<RootState, string>((state) => state.term);
  const collapsed = useSelector<RootState, boolean>((state) => state.courseCards[id].collapsed);
  const dispatch = useDispatch();
  const { course, customizationLevel, loading } = courseCardOptions;

  const [options, setOptions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const cardRef = React.useRef<HTMLElement>(null);
  // this keeps track of the collapsed state that is currently displayed
  // at the time of a re-render
  const [prevCollapsed, setPrevCollapsed] = React.useState(collapsed);
  const applyExpandCSS = (): void => {
    setPrevCollapsed(false);

    const rowEl = cardRef.current.parentElement;
    const content = rowEl.getElementsByClassName(styles.content)[0] as HTMLElement;
    const collapsedHeight = rowEl.scrollHeight;

    // calculate what height we need to set it to
    content.style.display = 'flex';
    rowEl.style.height = 'auto';
    requestAnimationFrame(() => {
      // this is the final height we need to reach
      const expandedHeight = rowEl.scrollHeight;
      // also calculate how much space there is
      let heightOthers = 0;
      for (let i = 0; i < rowEl.parentElement.childElementCount; i++) {
        const sibling = rowEl.parentElement.children[i];
        if (sibling !== rowEl) { heightOthers += sibling.scrollHeight; }
      }
      const heightAvailable = rowEl.parentElement.clientHeight - heightOthers;

      if (rowEl.className.includes(styles2.expandedRowSmall)) {
        // start where we are right now
        rowEl.style.height = `${collapsedHeight}px`;
        // we want to ignore min height for now and use only the height
        rowEl.style.minHeight = 'unset';

        requestAnimationFrame(() => {
          // and transition to the final height
          rowEl.style.height = `${expandedHeight}px`;

          const resetMinHeight = (): void => {
            // return to default values
            rowEl.style.minHeight = null;
            rowEl.style.height = null;

            rowEl.removeEventListener('transitionend', resetMinHeight);
          };
          rowEl.addEventListener('transitionend', resetMinHeight);
        });
      } else {
        console.log('not enough space');
        // start where we are right now
        rowEl.style.height = `${collapsedHeight}px`;
        // we want to ignore min height for now and use only the height
        rowEl.style.minHeight = 'unset';
        requestAnimationFrame(() => {
          // and transition to the max available height
          rowEl.style.height = `${heightAvailable}px`;

          const switchToMinHeight = (): void => {
            // now change to transitioning min height
            rowEl.style.transition = 'min-height 300ms linear 0ms';

            requestAnimationFrame(() => {
              rowEl.style.minHeight = `${heightAvailable}px`;

              requestAnimationFrame(() => {
                // transition min height up to 500 (set in .css file)
                rowEl.style.minHeight = null;
                // reset default height
                rowEl.style.height = null;
              });
            });
            rowEl.removeEventListener('transitionend', switchToMinHeight);
          };
          rowEl.addEventListener('transitionend', switchToMinHeight);
        });
      }
    });
  };

  const applyCollapseCSS = (): void => {
    setPrevCollapsed(true);

    const rowEl = cardRef.current.parentElement;
    const headerEl = cardRef.current.children[0];
    const expandedHeight = rowEl.scrollHeight;

    // temporarily disable CSS transitions
    rowEl.style.transition = '';

    // once the transition has been removed, set height to px instead of auto
    requestAnimationFrame(() => {
      rowEl.style.height = `${expandedHeight}px`;
      rowEl.style.transition = 'height 300ms linear 0ms';

      // once the height has been set in px, begin transitioning to minimum
      requestAnimationFrame(() => {
        const collapsedHeight = headerEl.scrollHeight;
        rowEl.style.height = `${collapsedHeight + 8}px`;
        // 8px is for the padding-top on rowEl

        const setDisplayNone = (evt: Event): void => {
          const contentEl = rowEl.getElementsByClassName(styles.content)[0] as HTMLElement;
          contentEl.style.display = 'none';
          console.log('bwahaha setting display none');

          rowEl.removeEventListener('transitionend', setDisplayNone);
        };
        rowEl.addEventListener('transitionend', setDisplayNone);
      });
    });
  };

  const toggleCollapsed = (): void => {
    dispatch(updateCourseCard(id, { collapsed: !collapsed }));
  };

  if (collapsed && !prevCollapsed) { applyCollapseCSS(); } else if (!collapsed && prevCollapsed) { applyExpandCSS(); }

  React.useLayoutEffect(() => {
    const rowEl = cardRef.current.parentElement;
    const content = rowEl.getElementsByClassName(styles.content)[0] as HTMLElement;
    if (collapsed) content.style.display = 'none';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getAutocomplete(text: string): void {
    fetch(`api/course/search?search=${text}&term=${term}`).then(
      (res) => res.json(),
    ).then((result) => {
      if (result.results) {
        setOptions(result.results);
      }
    });
  }

  const sectionSelect = React.useMemo(
    () => {
      console.log('running memo fxn');
      return (!loading && course ? <SectionSelect id={id} /> : null);
    },
    [course, id, loading],
  );

  // determine customization content based on whether the card is loading and customization level
  const customizationContent = React.useMemo(() => {
    // show loading if we're not sure what sections are available
    if (loading) {
      return (
        <div id={styles.centerProgress}>
          <SmallFastProgress />
          Loading sections...
        </div>
      );
    }
    switch (customizationLevel) {
      case CustomizationLevel.BASIC:
        return <BasicSelect id={id} />;
      case CustomizationLevel.SECTION:
        return course
          ? sectionSelect
          : (
            <Typography className={styles.grayText}>
              Select a course to show available sections
            </Typography>
          );
      default:
        return null;
    }
  }, [course, customizationLevel, id, loading, sectionSelect]);

  return (
    <Card className={styles.card} ref={cardRef}>
      <div
        className={styles.header}
        onClick={toggleCollapsed}
        role="button"
        tabIndex={0}
        onKeyPress={toggleCollapsed}
      >
        <div
          className={styles.headerGroup}
          onClick={(evt): void => {
            dispatch(removeCourseCard(id));
            evt.stopPropagation();
          }}
          role="button"
          tabIndex={0}
          onKeyPress={(evt): void => {
            dispatch(removeCourseCard(id));
            evt.stopPropagation();
          }}
          aria-label="Remove"
        >
          <RemoveIcon />
          {!collapsed && 'Remove'}
        </div>
        {collapsed && course}
        <div className={styles.headerGroup}>
          Collapse
          <CollapseIcon />
        </div>
      </div>
      <div className={styles.content}>
        <Autocomplete
          options={options}
          size="small"
          autoHighlight
          autoSelect
          disabled={loading}
          inputValue={inputValue}
          value={course}
          multiple={false}
          filterOptions={(): any[] => options} // Options are not filtered
          getOptionSelected={(option): boolean => option === options[0]}
          onClose={(): void => {
            if (options.length === 0) setInputValue('');
          }}
          onChange={(_evt: object, val: string): void => {
            dispatch(updateCourseCard(id, {
              course: val,
            }, term));
          }}
          onInputChange={(_evt: object, val: string, reason: string): void => {
            setInputValue(val);
            if (val === '') { // Skip empty inputs
              setOptions([]); // Clear the autocomplete options so previous results don't show
              return;
            }

            if (reason !== 'reset') getAutocomplete(val);
          }}
          renderInput={(params: any): JSX.Element => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Course" fullWidth autoFocus variant="outlined" />
          )}
          classes={{ root: styles.courseInput }}
        />
        <FormLabel component="label" style={{ marginTop: 16 }} focused={false}>
            Customization Level:
        </FormLabel>
        <ButtonGroup className={styles.customizationButtons}>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.BASIC ? 'contained' : 'outlined'}
            onClick={(): void => {
              dispatch(updateCourseCard(id, {
                customizationLevel: CustomizationLevel.BASIC,
              }));
            }}
          >
              Basic
          </Button>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.SECTION ? 'contained' : 'outlined'}
            onClick={(): void => {
              dispatch(updateCourseCard(id, {
                customizationLevel: CustomizationLevel.SECTION,
              }));
            }}
          >
              Section
          </Button>
        </ButtonGroup>
        {customizationContent}
      </div>
    </Card>
  );
};

export default CourseSelectCard;
