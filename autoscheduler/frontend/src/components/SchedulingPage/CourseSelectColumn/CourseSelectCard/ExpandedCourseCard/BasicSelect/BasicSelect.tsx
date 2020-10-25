import * as React from 'react';
import { Typography, FormLabel } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './BasicSelect.css';
import BasicOptionRow from './BasicOptionRow';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course || '');
  const hasHonors = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].hasHonors || false,
  );
  const hasWeb = useSelector<RootState, boolean>((state) => state.courseCards[id].hasWeb || false);

  // shows placeholder text if no course is selected
  if (!course) {
    return (
      <Typography className={styles.grayText} variant="body1">
        Select a course to show available options
      </Typography>
    );
  }

  // show placeholder message if there are no special sections to filter
  if (!hasHonors && !hasWeb) {
    return (
      <Typography className={styles.grayText}>
        There are no honors or online sections for this class
      </Typography>
    );
  }

  return (
    <>
      <FormLabel>Options</FormLabel>
      <table className={styles.tableContainer}>
        <tbody>
          {hasHonors
            ? <BasicOptionRow id={id} value="honors" />
            : null}
          {hasWeb
            ? <BasicOptionRow id={id} value="web" />
            : null}
        </tbody>
      </table>
    </>
  );
};

export default BasicSelect;
