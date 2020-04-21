import * as React from 'react';
import {
  Typography, FormLabel, Select, MenuItem, InputLabel,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../redux/actions/courseCards';
import * as styles from './BasicSelect.css';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const web = useSelector<RootState, boolean>((state) => state.courseCards[id].web || false);
  const honors = useSelector<RootState, boolean>((state) => state.courseCards[id].honors || false);
  const dispatch = useDispatch();

  return (
    <>
      <FormLabel>Options</FormLabel>
      <table className={styles.fitContent}>
        <tr>
          <td>
            <Typography variant="body1" style={{ paddingRight: 8 }} id={`honors-${id}`}>Honors:</Typography>
          </td>
          <td>
            <Select value="include" classes={{ root: styles.fitContent }} labelId={`honors-${id}`}>
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
            <Select value="include" classes={{ root: styles.fitContent }} labelId={`online-${id}`}>
              <MenuItem value="include">Include</MenuItem>
              <MenuItem value="exclude">Exclude</MenuItem>
              <MenuItem value="only">Only</MenuItem>
            </Select>
          </td>
        </tr>
      </table>
    </>
  );
};

export default BasicSelect;
