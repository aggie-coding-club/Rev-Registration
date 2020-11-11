import { ListSubheader, Tooltip, Divider, Checkbox } from '@material-ui/core';
import HonorsIcon from '@material-ui/icons/School';
import * as React from 'react';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import GradeDist from './GradeDist/GradeDist';
import SectionInfo from './SectionInfo';
import * as styles from './SectionSelect.css';

interface ProfessorGroupProps {
  sections: SectionSelected[];
  courseCardId: number;
  currProfGroupStart: number;
}

const ProfessorGroup: React.FC<ProfessorGroupProps> = ({
  sections, courseCardId, currProfGroupStart,
}) => {
  const firstSection = sections[0].section;

  const instructorHeader = (
    <ListSubheader disableGutters className={styles.listSubheaderDense}>
      <div className={styles.listSubheaderContent}>
        <div className={styles.nameHonorsIcon}>
          {firstSection.instructor.name}
          {firstSection.honors ? (
            <Tooltip title="Honors" placement="right">
              <HonorsIcon fontSize="small" data-testid="honors" />
            </Tooltip>
          ) : null}
        </div>
        {firstSection.grades
          ? <GradeDist grades={firstSection.grades} />
          : (
            <div className={styles.noGradesAvailable}>
              No grades available
            </div>
          )}
      </div>
      <div className={styles.dividerContainer}>
        <Divider />
      </div>
    </ListSubheader>
  );

  return (
    <ul key={firstSection.instructor.name + firstSection.honors} className={styles.noStartPadding}>
      {instructorHeader}
      {sections.map((secData, offset) => (
        <SectionInfo
          secIdx={currProfGroupStart + offset}
          courseCardId={courseCardId}
          sectionData={secData}
          addInstructorLabel={offset === 0}
          isLastSection={offset === sections.length - 1}
          key={secData.section.id}
        />
      ))}
    </ul>
  );
};

export default ProfessorGroup;
