import * as React from 'react';
import RemoveIcon from '@material-ui/icons/Close';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, FormLabel, Card, Typography,
} from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';
import * as styles from './ExpandedCourseCard.css';
import SectionSelect from './SectionSelect/SectionSelect';
import BasicSelect from './BasicSelect/BasicSelect';
import { CustomizationLevel, CourseCardOptions } from '../../../../types/CourseCardOptions';
import { RootState } from '../../../../redux/reducer';
import { updateCourseCard, removeCourseCard } from '../../../../redux/actions/courseCards';

interface ExpandedCourseCardProps {
  onCollapse: Function;
  id: number;
}

const ExpandedCourseCard: React.FC<ExpandedCourseCardProps> = ({
  onCollapse, id,
}) => {
  const courseCardOptions = useSelector<RootState, CourseCardOptions>(
    (state) => state.courseCards[id],
  );
  const dispatch = useDispatch();
  const { course, customizationLevel } = courseCardOptions;

  const [options, setOptions] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');

  function getAutocomplete(text: string): void {
    fetch(`api/course/search?search=${text}&term=201931`).then(
      (res) => res.json(),
    ).then((result) => {
      if (result.results) {
        setOptions(result.results);
      }
    });
  }

  // determine customization content based on customization level
  let customizationContent: JSX.Element = null;
  switch (customizationLevel) {
    case CustomizationLevel.BASIC:
      customizationContent = <BasicSelect id={id} />;
      break;
    case CustomizationLevel.SECTION:
      customizationContent = course
        ? <SectionSelect id={id} />
        : (
          <Typography className={styles.grayText}>
            Select a course to show available sections
          </Typography>
        );
      break;
    default:
      customizationContent = null;
  }

  return (
    <Card>
      <div className={styles.header}>
        <div
          className={styles.headerGroup}
          onClick={(): void => { dispatch(removeCourseCard(id)); }}
          role="button"
          tabIndex={0}
          onKeyPress={(): void => { dispatch(removeCourseCard(id)); }}
        >
          <RemoveIcon />
          Remove
        </div>
        <div
          className={styles.headerGroup}
          onClick={(): void => onCollapse(course)}
          role="button"
          tabIndex={0}
          onKeyPress={(): void => onCollapse(course)}
        >
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
          inputValue={inputValue}
          value={course}
          multiple={false}
          onClose={(): void => {
            if (!options.find((val) => val === inputValue)) setInputValue('');
          }}
          onChange={(evt: object, val: string): void => {
            dispatch(updateCourseCard(id, {
              course: val,
            }));
          }}
          onInputChange={(evt: object, val: string, reason: string): void => {
            setInputValue(val);
            if (reason !== 'reset') getAutocomplete(val);
          }}
          renderInput={(params: any): JSX.Element => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Course" fullWidth variant="outlined" />
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

export default ExpandedCourseCard;
