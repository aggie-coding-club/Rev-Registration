import * as React from 'react';
import { List, Typography } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import SectionInfo from './SectionInfo';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections, (left, right) => left === right,
  );

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    return sections.map((sectionData, secIdx) => {
      const makeNewGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;

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

  return (
    <List disablePadding className={styles.sectionRows}>
      {makeList()}
    </List>
  );
};

export default SectionSelect;
