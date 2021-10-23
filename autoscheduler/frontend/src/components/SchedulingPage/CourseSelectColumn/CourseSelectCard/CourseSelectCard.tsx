import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RemoveIcon from '@material-ui/icons/Delete';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, Card, Collapse as CollapseBase, Switch,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { RootState } from '../../../../redux/reducer';
import { updateCourseCard } from '../../../../redux/actions/courseCards';
import { CourseCardOptions } from '../../../../types/CourseCardOptions';
import SmallFastProgress from '../../../SmallFastProgress';

import * as styles from './ExpandedCourseCard/ExpandedCourseCard.css';
import SectionSelect from './ExpandedCourseCard/SectionSelect/SectionSelect';
import { getCourseCardHeaderColor } from '../../../../theme';

const Collapse = withStyles({
  container: {
    display: 'flex',
    // backgroundColor: 'magenta',
  },
  wrapper: {
    width: '100%',
  },
  // entered: {
  //   height: '800px',
  //   backgroundColor: 'cyan',
  //   overflow: 'visible',
  // },
})(CollapseBase);

interface CourseSelectCardProps {
  // id of the course card in Redux whose information will be displayed
  id: number;
  // whether the card should be collapsed or expanded
  collapsed: boolean;
  // (optional) callback to run when height is potentially changed
  onHeightChange?: () => any;
  // (optional) can be used to expand the card in 1 frame (without playing the transition)
  shouldAnimate?: boolean;
  // (optional) callback that will be run when user clicks the remove button. Noop by default.
  removeCourseCard?: (index: number) => void;
  // (optional) callback that CourseSelectColumn uses to re-enable animations after a removal
  resetAnimCb?: () => void;
}
const doNothing = (): void => {};

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({
  id, collapsed, shouldAnimate = true, removeCourseCard = doNothing,
  resetAnimCb = doNothing, onHeightChange = doNothing,
}) => {
  const dispatch = useDispatch();
  const term = useSelector<RootState, string>((state) => state.termData.term);
  const {
    course, loading, disabled,
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
          inputProps={{ 'aria-checked': !disabled }}
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

    return (
      <>
        <SectionSelect id={id} onHeightChange={onHeightChange} />
      </>
    );
  };

  const collapsibleContent = (
    <div className={styles.content} aria-hidden={collapsed}>
      <Autocomplete
        options={options}
        size="small"
        autoHighlight
        disabled={loading}
        inputValue={inputValue}
        value={course}
        multiple={false}
        filterOptions={(): any[] => options} // Options are not filtered
        getOptionSelected={(option): boolean => option === options[0]}
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
