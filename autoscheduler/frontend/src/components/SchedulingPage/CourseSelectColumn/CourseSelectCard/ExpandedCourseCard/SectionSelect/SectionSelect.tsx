import * as React from 'react';
import { List, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
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
    let currProfGroupStart = 0;
    return sections.map((sectionData, secIdx) => {
      const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
      if (firstInProfGroup) currProfGroupStart = secIdx;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;

      const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

      if (!lastInProfGroup) return null;

      return (
        <ul key={lastProf + lastHonors} className={styles.noStartPadding}>
          {sections.slice(currProfGroupStart, secIdx + 1).map((iterSecData, offset) => (
            <SectionInfo
              secIdx={currProfGroupStart + offset}
              courseCardId={id}
              sectionData={iterSecData}
              addInstructorLabel={offset === 0}
              isLastSection={currProfGroupStart + offset === secIdx}
              key={iterSecData.section.id}
            />
          ))}
        </ul>
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
