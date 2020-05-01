import * as React from 'react';
import { Typography, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './BasicSelect.css';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import BasicOptionRow from './BasicOptionRow';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course || '');
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );

  // shows placeholder text if no course is selected
  if (!course) {
    return (
      <Typography className={styles.grayText} variant="body1">
        Select a course to show available options
      </Typography>
    );
  }

  // determine whether or not there are honors or web sections
  const hasHonorsSections = sections.some((secData) => secData.section.honors);
  const hasWebSections = sections.some((secData) => secData.section.web);

  // show placeholder message if there are no special sections to filter
  if (!hasHonorsSections && !hasWebSections) {
    return (
      <Typography className={styles.grayText}>
        There are no honors or online courses for this class
      </Typography>
    );
  }

  return (
    <>
      <FormLabel>Options</FormLabel>
      <table className={styles.tableContainer}>
        <tbody>
          {hasHonorsSections
            ? <BasicOptionRow id={id} value="honors" />
            : null}
          {hasWebSections
            ? <BasicOptionRow id={id} value="web" />
            : null}
        </tbody>
      </table>
    </>
  );
};

export default BasicSelect;
