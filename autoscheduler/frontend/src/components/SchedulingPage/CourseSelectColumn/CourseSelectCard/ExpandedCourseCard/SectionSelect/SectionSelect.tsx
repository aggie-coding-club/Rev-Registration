import * as React from 'react';
import { List, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import ProfessorGroup from './ProfessorGroup';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = 0;
    return sections.map((sectionData, secIdx) => {
      const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
      if (firstInProfGroup) currProfGroupStart = secIdx;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;

      const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

      // all sections in a group will be added at the same time
      if (!lastInProfGroup) return null;

      return (
        <ProfessorGroup
          sectionRange={[currProfGroupStart, secIdx + 1]}
          courseCardId={id}
          key={lastProf + lastHonors}
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
