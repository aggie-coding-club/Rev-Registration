import {
  ListSubheader, Tooltip, Divider, Checkbox,
} from '@material-ui/core';
import HonorsIcon from '@material-ui/icons/School';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSelected } from '../../../../../../redux/actions/courseCards';
import { RootState } from '../../../../../../redux/reducer';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import GradeDist from './GradeDist/GradeDist';
import SectionInfo from './SectionInfo';
import * as styles from './SectionSelect.css';

interface ProfessorGroupProps {
  courseCardId: number;
  startIdx: number;
  endIdx: number;
}

const ProfessorGroup: React.FC<ProfessorGroupProps> = ({
  courseCardId, startIdx, endIdx,
}) => {
  const dispatch = useDispatch();
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[courseCardId].sections.slice(startIdx, endIdx)
  )
  const areAllChecked = sections.every((secData) => secData.selected);
  const firstSection = sections[0].section;
  const toggleAllSelected = (): void => {
    sections.forEach((_, idx) => dispatch(toggleSelected(courseCardId, startIdx + idx)));
  };

  const instructorHeader = (
    <ListSubheader disableGutters className={styles.listSubheaderDense}>
      <div className={styles.listSubheaderContent}>
        <div className={styles.nameHonorsIcon}>
          <Checkbox 
            checked={areAllChecked} 
            size="small" 
            onClick={toggleAllSelected} 
            value={areAllChecked ? 'on' : 'off'}
            title="Select All" />
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
          secIdx={startIdx + offset}
          courseCardId={courseCardId}
          sectionData={secData}
          addInstructorLabel={offset === 0}
          isLastSection={offset === endIdx - 1}
          key={secData.section.id}
        />
      ))}
    </ul>
  );
};

export default ProfessorGroup;
