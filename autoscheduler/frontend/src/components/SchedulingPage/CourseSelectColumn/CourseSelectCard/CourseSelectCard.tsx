import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Delete';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, FormLabel, Card, Typography, Collapse, Switch,
} from '@material-ui/core';
import { RootState } from '../../../../redux/reducer';
import { updateCourseCard } from '../../../../redux/actions/courseCards';
import { CustomizationLevel, CourseCardOptions } from '../../../../types/CourseCardOptions';
import SmallFastProgress from '../../../SmallFastProgress';

import * as styles from './ExpandedCourseCard/ExpandedCourseCard.css';
import SectionSelect from './ExpandedCourseCard/SectionSelect/SectionSelect';
import BasicSelect from './ExpandedCourseCard/BasicSelect/BasicSelect';
import { getCourseCardHeaderColor } from '../../../../theme';

interface CourseSelectCardProps {
  // id of the course card in Redux whose information will be displayed
  id: number;
  // whether the card should be collapsed or expanded
  collapsed: boolean;
  // (optional) can be used to expand the card in 1 frame (without playing the transition)
  shouldAnimate?: boolean;
  // (optional) callback that will be run when user clicks the remove button. Noop by default.
  removeCourseCard?: (index: number) => void;
  // (optional) callback that CourseSelectColumn uses to re-enable animations after a removal
  resetAnimCb?: () => void;
}
const doNothing = (): void => {};

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({
  id, collapsed, shouldAnimate = true, removeCourseCard = doNothing, resetAnimCb = doNothing,
}) => {
  const dispatch = useDispatch();
  const term = useSelector<RootState, string>((state) => state.termData.term);
  const {
    course, customizationLevel, loading, disabled,
  } = useSelector<RootState, CourseCardOptions>(
    (state) => state.termData.courseCards[id],
  );

  const [options, setOptions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  const toggleCollapsed = (): void => {
    dispatch(updateCourseCard(id, { collapsed: !collapsed }));
  };

  const header = (
    <div
      className={styles.header}
      onClick={toggleCollapsed}
      role="button"
      tabIndex={0}
      onKeyPress={toggleCollapsed}
      style={{
        backgroundColor: getCourseCardHeaderColor(disabled),
      }}
      data-testid="card-header"
    >
      <div
        className={styles.headerGroup}
        onClick={(evt): void => {
          removeCourseCard(id);
          evt.stopPropagation();
        }}
        role="button"
        tabIndex={0}
        onKeyPress={(evt): void => {
          removeCourseCard(id);
          evt.stopPropagation();
        }}
        aria-label="Remove"
      >
        <RemoveIcon />
      </div>
      <div className={styles.rightHeaderGroup}>
        <span className={styles.course}>{collapsed && (course || 'No Course Selected')}</span>
        <span className={styles.includeInSchedules}>{!collapsed && 'Include in schedules'}</span>
        <Switch
          aria-label="Disable"
          checked={!disabled}
          onClick={(evt): void => {
            dispatch(updateCourseCard(id, { disabled: !disabled }));
            evt.stopPropagation();
          }}
        />
        <div className={styles.headerGroup}>
          <CollapseIcon
            classes={{ root: styles.rotatableIcon }}
            style={{
              transform: collapsed ? '' : 'rotate(180deg)',
            }}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          />
        </div>
      </div>
    </div>
  );

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
          <Typography color="textSecondary">
            Select a course to show available sections
          </Typography>
        </div>
      </>
    );
  };

  const collapsibleContent = (
    <div className={styles.content} aria-hidden={collapsed}>
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
  );

  return (
    <Card className={styles.card}>
      {header}
      <Collapse in={!collapsed} appear enter={shouldAnimate} onEntered={resetAnimCb}>
        {collapsibleContent}
      </Collapse>
    </Card>
  );
};

export default React.memo(CourseSelectCard, (prev, next) => prev.collapsed && next.collapsed);
