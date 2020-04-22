import * as React from 'react';
import {
  Typography, FormLabel, Select, MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import * as styles from './BasicSelect.css';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course || '');
  const web = useSelector<RootState, string>((state) => state.courseCards[id].web || 'include');
  const honors = useSelector<RootState, string>((state) => state.courseCards[id].honors || 'include');
  const dispatch = useDispatch();

  // shows alternative message if no course is selected
  if (!course) {
    return (
      <Typography className={styles.grayText} variant="body1">
        Select a course to show available options
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
              <Typography variant="body1" style={{ paddingRight: 8 }} id={`honors-${id}`}>Honors:</Typography>
            </td>
            <td>
              <Select
                value={honors}
                classes={{ root: styles.fitContent }}
                labelId={`honors-${id}`}
                onChange={(evt): void => {
                  dispatch(updateCourseCard(id, { honors: evt.target.value as string }));
                }}
              >
                <MenuItem value="include">Include</MenuItem>
                <MenuItem value="exclude">Exclude</MenuItem>
                <MenuItem value="only">Only</MenuItem>
              </Select>
            </td>
          </tr>
          <tr>
            <td>
              <Typography variant="body1" style={{ paddingRight: 8 }} id={`online-${id}`}>Online:</Typography>
            </td>
            <td>
              <Select
                value={web}
                classes={{ root: styles.fitContent }}
                labelId={`online-${id}`}
                onChange={(evt): void => {
                  dispatch(updateCourseCard(id, { web: evt.target.value as string }));
                }}
              >
                <MenuItem value="include">Include</MenuItem>
                <MenuItem value="exclude">Exclude</MenuItem>
                <MenuItem value="only">Only</MenuItem>
              </Select>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default BasicSelect;
