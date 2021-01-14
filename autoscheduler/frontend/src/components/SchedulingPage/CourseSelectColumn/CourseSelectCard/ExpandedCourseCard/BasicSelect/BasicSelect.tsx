import * as React from 'react';
import {
  Typography, FormLabel, Checkbox,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
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
  const hasRemote = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].hasRemote || false,
  );
  const hasAsynchronous = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].hasAsynchronous || false,
  );
  const includeFull = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].includeFull || false,
  );
  const dispatch = useDispatch();

  // shows placeholder text if no course is selected
  if (!course) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary" variant="body1">
        Select a course to show available options
      </Typography>
    );
  }

  // show placeholder message if there are no special sections to filter
  if (!hasHonors && !hasRemote && !hasAsynchronous) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary">
        There are no honors or remote sections for this class
      </Typography>
    );
  }

  return (
    <>
      <FormLabel>Options</FormLabel>
      <table className={styles.tableContainer}>
        <tbody>
          <tr>
            <td>
              <Typography variant="body1" style={{ paddingRight: 8 }}>
            Include Full Sections:
              </Typography>
            </td>
            <td>
              <Checkbox
                color="primary"
                style={{ padding: 0 }}
                checked={includeFull}
                onChange={(): void => {
                  dispatch(updateCourseCard(id, { includeFull: !includeFull }));
                }}
              />
            </td>
          </tr>
          {hasHonors
            ? <BasicOptionRow id={id} value="honors" label="Honors" />
            : null}
          {hasRemote
            ? <BasicOptionRow id={id} value="remote" label="Remote" />
            : null}
          {hasAsynchronous
            ? <BasicOptionRow id={id} value="asynchronous" label="No Meeting Times" />
            : null}
        </tbody>
      </table>
    </>
  );
};

export default BasicSelect;
