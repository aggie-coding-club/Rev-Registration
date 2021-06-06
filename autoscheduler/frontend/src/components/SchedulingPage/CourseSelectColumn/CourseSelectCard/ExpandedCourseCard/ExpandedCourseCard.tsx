import * as React from 'react';
import RemoveIcon from '@material-ui/icons/Delete';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, FormLabel, Card, Typography,
} from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';
import * as styles from './ExpandedCourseCard.css';
import SectionSelect from './SectionSelect/SectionSelect';
import { CourseCardOptions } from '../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../redux/reducer';
import { updateCourseCard, removeCourseCard } from '../../../../../redux/actions/courseCards';
import SmallFastProgress from '../../../../SmallFastProgress';

interface ExpandedCourseCardProps {
  onCollapse: Function;
  id: number;
}

const ExpandedCourseCard: React.FC<ExpandedCourseCardProps> = ({
  onCollapse, id,
}) => {
  const courseCardOptions = useSelector<RootState, CourseCardOptions>(
    (state) => state.termData.courseCards[id],
  );

  const term = useSelector<RootState, string>((state) => state.termData.term);
  const dispatch = useDispatch();
  const { course, loading } = courseCardOptions;

  const [options, setOptions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

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
    return <SectionSelect id={id} />;
  }, [id, loading]);

  return (
    <Card className={styles.card}>
      <div
        className={styles.header}
        onClick={(): void => onCollapse(course)}
        role="button"
        tabIndex={0}
        onKeyPress={(): void => onCollapse(course)}
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
          Remove
        </div>
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
        {customizationContent}
      </div>
    </Card>
  );
};

export default ExpandedCourseCard;
