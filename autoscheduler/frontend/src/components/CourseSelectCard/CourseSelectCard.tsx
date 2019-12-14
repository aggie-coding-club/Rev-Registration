import * as React from 'react';
import RemoveIcon from '@material-ui/icons/Close';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  TextField, ButtonGroup, Button, FormLabel, Card,
} from '@material-ui/core';

import * as styles from './CourseSelectCard.css';
import ProfessorSelect from './ProfessorSelect/ProfessorSelect';
import SectionSelect from './SectionSelect/SectionSelect';
import BasicSelect from './BasicSelect/BasicSelect';
import fetch from './testData'; // DEBUG
import Meeting from '../../types/Meeting';

enum CustomizationLevel {
  BASIC, PROFESSOR, SECTION
}

const CourseSelectCard = (): JSX.Element => {
  const [customizationLevel, setCustomizationLevel] = React.useState(CustomizationLevel.BASIC);
  const [course, setCourse] = React.useState('');
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);

  // fetch meetings for course when the course changes
  React.useEffect(() => {
    // only fetch if course is not an empty string
    if (course) {
      // parse response and set meetings appropriately
      fetch(`/api/${encodeURIComponent(course)}/meetings`).then((res) => res.json()).then(
        (res) => setMeetings(res),
      );
    }
  }, [course]);

  // determine customization content based on customization level
  let customizationContent: JSX.Element = null;
  switch (customizationLevel) {
    case CustomizationLevel.BASIC:
      customizationContent = <BasicSelect />;
      break;
    case CustomizationLevel.PROFESSOR:
      customizationContent = <ProfessorSelect />;
      break;
    case CustomizationLevel.SECTION:
      customizationContent = <SectionSelect meetings={meetings} />;
      break;
    default:
      customizationContent = null;
  }

  return (
    <Card>
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
          size="small"
          value={course}
          onChange={(evt, val): void => setCourse(val)}
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
    </Card>
  );
};

export default CourseSelectCard;
