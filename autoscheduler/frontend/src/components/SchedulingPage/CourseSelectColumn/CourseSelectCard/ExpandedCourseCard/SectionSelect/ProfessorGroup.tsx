import {
  Button,
  Checkbox, Divider, ListSubheader, Tooltip,
} from '@material-ui/core';
import HonorsIcon from '@material-ui/icons/School';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected } from '../../../../../../redux/actions/courseCards';
import { RootState } from '../../../../../../redux/reducer';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import GradeDist from './GradeDist/GradeDist';
import SectionInfo from './SectionInfo';
import * as styles from './SectionSelect.css';

interface ProfessorGroupProps {
  courseCardId: number;
  sectionRange: [number, number];
}

/**
 * Renders a group of sections that have the same professors and honors status, including the
 * instructor header at the top.
 *
 * @param props This component takes 2 props, `courseCardId` and `sectionRange`. `sectionRange`
 * should be a tuple of 2 numbers `[startIdx, endIdx]`, where `startIdx` is the first section
 * that should be rendered in this group and `endIdx` is one more than the last section in this
 * group
 */
const ProfessorGroup: React.FC<ProfessorGroupProps> = ({ courseCardId, sectionRange }) => {
  const [startIdx, endIdx] = sectionRange;

  const dispatch = useDispatch();
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[courseCardId].sections.slice(startIdx, endIdx),
  );
  const areAllSelected = sections.every((secData) => secData.selected);
  const areAnySelected = sections.some((secData) => secData.selected);
  const firstSection = sections[0].section;
  const toggleAllSelected = (): void => {
    sections.forEach((_, idx) => dispatch(
      setSelected(courseCardId, startIdx + idx, !areAnySelected),
    ));
  };

  const instructorHeader = (
    <ListSubheader disableGutters className={styles.listSubheaderDense}>
      <div className={styles.listSubheaderContent}>
        <Button
          className={styles.nameHonorsIcon}
          onClick={toggleAllSelected}
          aria-label="Select all for professor"
        >
          <Checkbox
            checked={areAnySelected}
            indeterminate={areAnySelected && !areAllSelected}
            size="small"
            color="primary"
            value={areAllSelected ? 'professor on' : 'professor off'}
            classes={{ root: styles.lessCheckboxPadding }}
          />
          {firstSection.instructor.name}
          {firstSection.honors ? (
            <Tooltip title="Honors" placement="right">
              <HonorsIcon fontSize="small" data-testid="honors" />
            </Tooltip>
          ) : null}
        </Button>
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
    <ul className={styles.noStartPadding}>
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
