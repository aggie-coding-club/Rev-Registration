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
import * as parentStyles from '../CourseSelectColumn.css';
import * as childStyles from './ExpandedCourseCard/SectionSelect/SectionSelect.css';
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

  const toggleCollapsed = (): void => {
    dispatch(updateCourseCard(id, { collapsed: !collapsed }));
  };

  const contentRef = React.useRef<HTMLDivElement>(null);
  const fixHeight = (): void => {
    let parentEl = contentRef.current.parentElement;
    while (parentEl && !parentEl.classList.contains(parentStyles.expandedRow)) {
      parentEl = parentEl.parentElement;
    }
    if (parentEl) {
      // parent is now pointing to the expanded row that is the parent of this element
      const sectionRows = contentRef.current
        .getElementsByClassName(childStyles.sectionRows)[0] as HTMLElement;
      sectionRows.style.height = `${parentEl.scrollHeight - 182}px`;
      // 182 is epxerimentally measured and will need to be updated as card content changes
    }
    // ignore renders when parentEl is not found
  };

  function getAutocomplete(text: string): void {
    fetch(`api/course/search?search=${text}&term=${term}`).then(
      (res) => res.json(),
    ).then((result) => {
      if (result.results) {
        setOptions(result.results);
      }
    });
  }

  // determine customization content based on whether the card is loading and customization level
  const getCustomizationContent = (): JSX.Element => {
    // show loading if we're not sure what sections are available
    if (loading) {
      return (
        <div id={styles.centerProgress}>
          <SmallFastProgress />
          Loading sections...
        </div>
      );
    }

    const showBasic = customizationLevel === CustomizationLevel.BASIC;
    const showSection = customizationLevel === CustomizationLevel.SECTION && course;
    const showHint = customizationLevel === CustomizationLevel.SECTION && !course;
    return (
      <>
        <div style={{ display: showBasic ? 'block' : 'none' }}>
          <BasicSelect id={id} />
        </div>
        <div style={{ display: showSection ? 'contents' : 'none' }}>
          <SectionSelect id={id} />
        </div>
        <div style={{ display: showHint ? 'block' : 'none' }}>
          <Typography className={styles.grayText}>
            Select a course to show available sections
          </Typography>
        </div>
      </>
    );
  };

  return (
    <Card className={styles.card}>
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
      <Collapse in={!collapsed} onEntered={fixHeight}>
        <div className={styles.content} ref={contentRef}>
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
          {getCustomizationContent()}
        </div>
      </Collapse>
    </Card>
  );
};

export default CourseSelectCard;
