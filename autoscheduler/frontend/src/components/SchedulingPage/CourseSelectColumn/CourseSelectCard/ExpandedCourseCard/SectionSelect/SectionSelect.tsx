import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Typography, Checkbox } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';

import { makeStyles } from '@material-ui/styles';
import { toggleSelectedAll } from '../../../../../../redux/actions/courseCards';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import SectionInfo from './SectionInfo';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );

  // for select all
  // override certain material ui styles
  const useStyles = makeStyles({
    rootToggleButton: {
      border: 'none',
      textAlign: 'left',
      padding: '0',
      fontSize: '110%',
      fontWeight: 800,
      color: 'rgba(0, 0, 0, 0.83)',
    },
    rootCheckbox: {
      padding: '0 3px 0 0',
    },
  });
  const classes = useStyles();
  // toggleSelectedAll
  const dispatch = useDispatch();

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  let countSelected = 0;
  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    return sections.map((sectionData, secIdx) => {
      const makeNewGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;
      countSelected += (sectionData.selected ? 1 : 0);

      return (
        <SectionInfo
          secIdx={secIdx}
          courseCardId={id}
          sectionData={sectionData}
          addInstructorLabel={makeNewGroup}
          key={sectionData.section.id}
        />
      );
    });
  };

  // pre-making list so we can tell if the select-all checkbox should be checked
  const list = makeList();
  const allSelected: boolean = countSelected === sections.length;
  const sectionSelectOptions = (
    <div>
      {/* <ToggleButton className={styles.selectAll} value="select-all" aria-label="select all"> */}
      <ToggleButton classes={{ root: classes.rootToggleButton }} value="select-all" aria-label="select all" onChange={(): void => { dispatch(toggleSelectedAll(id, !allSelected)); }}>
        <Checkbox
          checked={allSelected}
          value={(allSelected) ? 'allOn' : 'allOff'}
          color="primary"
          size="small"
          classes={{ root: classes.rootCheckbox }}
        />
      SELECT ALL
      </ToggleButton>
    </div>
  );

  return (
    <>
      {sectionSelectOptions}
      <List disablePadding className={styles.sectionRows}>
        {list}
      </List>
    </>
  );
};

export default SectionSelect;
