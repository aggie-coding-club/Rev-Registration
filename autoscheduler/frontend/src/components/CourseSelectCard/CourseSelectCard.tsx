import * as React from 'react';
import RemoveIcon from '@material-ui/icons/Close';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, RadioGroup, FormControl, FormLabel, FormControlLabel, Radio,
} from '@material-ui/core';

import * as styles from './CourseSelectCard.css';
import ProfessorSelect from './ProfessorSelect/ProfessorSelect';
import SectionSelect from './SectionSelect/SectionSelect';

enum CustomizationLevel {
  BASIC, PROFESSOR, SECTION
}

const CourseSelectCard = (): JSX.Element => {
  const [customizationLevel, setCustomizationLevel] = React.useState(CustomizationLevel.BASIC);
  const [sectionFilter, setSectionFilter] = React.useState('allSections');

  // determine customization content based on customization level
  let customizationContent: JSX.Element = null;
  switch (customizationLevel) {
    case CustomizationLevel.BASIC:
      customizationContent = (
        <FormControl component="fieldset">
          <FormLabel component="label">Options</FormLabel>
          <RadioGroup
            value={sectionFilter}
            onChange={(evt): void => setSectionFilter(evt.target.value)}
          >
            <FormControlLabel value="allSections" control={<Radio color="primary" />} label="All Sections" />
            <FormControlLabel value="honorsOnly" control={<Radio color="primary" />} label="Honors Only" />
            <FormControlLabel value="webOnly" control={<Radio color="primary" />} label="Web Only" />
          </RadioGroup>
        </FormControl>
      );
      break;
    case CustomizationLevel.PROFESSOR:
      customizationContent = <ProfessorSelect />;
      break;
    case CustomizationLevel.SECTION:
      customizationContent = <SectionSelect />;
      break;
    default:
      customizationContent = null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerGroup}>
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
          options={['CSCE 121', 'MATH 151', 'CSCE 221']}
          freeSolo
          renderInput={(params): JSX.Element => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <TextField {...params} label="Course" fullWidth variant="outlined" />
          )}
        />
        <FormLabel component="label" style={{ marginTop: 16 }}>Customization Level:</FormLabel>
        <ButtonGroup className={styles.customizationButtons}>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.BASIC ? 'contained' : 'outlined'}
            onMouseDown={(): void => setCustomizationLevel(CustomizationLevel.BASIC)}
          >
            Basic
          </Button>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.PROFESSOR ? 'contained' : 'outlined'}
            onMouseDown={(): void => setCustomizationLevel(CustomizationLevel.PROFESSOR)}
          >
            Professor
          </Button>
          <Button
            className={styles.noElevation}
            color="primary"
            variant={customizationLevel === CustomizationLevel.SECTION ? 'contained' : 'outlined'}
            onMouseDown={(): void => setCustomizationLevel(CustomizationLevel.SECTION)}
          >
            Section
          </Button>
        </ButtonGroup>
        {customizationContent}
      </div>
    </div>
  );
};

export default CourseSelectCard;
