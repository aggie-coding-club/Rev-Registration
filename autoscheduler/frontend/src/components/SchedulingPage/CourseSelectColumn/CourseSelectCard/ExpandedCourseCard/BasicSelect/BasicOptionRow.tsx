import * as React from 'react';
import { Typography, Select, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import * as styles from './BasicSelect.css';

interface BasicOptionRowProps {
    id: number;
    value: 'honors' | 'web';
}

/**
 * Renders one row in the BasicSelect table
 * @param props include id of the course card and value, which should be the name of the
 * option selected by this row, formatted as it is found in the Redux course cards
 */
const BasicOptionRow: React.FC<BasicOptionRowProps> = ({ id, value }) => {
  const option = useSelector<RootState, string>((state) => state.courseCards[id][value] || 'no_preference');
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <Typography variant="body1" style={{ paddingRight: 8 }} id={`${value}-${id}`}>
          {`${value.slice(0, 1).toUpperCase().concat(value.slice(1))}:`}
        </Typography>
      </td>
      <td>
        <Select
          variant="outlined"
          value={option}
          classes={{ root: styles.selectRoot, selectMenu: styles.selectMenu }}
          labelId={`${value}-${id}`}
          onChange={(evt): void => {
            dispatch(updateCourseCard(id, { [value]: evt.target.value as string }));
          }}
        >
          <MenuItem value="no_preference">No Preference</MenuItem>
          <MenuItem value="exclude">Exclude</MenuItem>
          <MenuItem value="only">Only</MenuItem>
        </Select>
      </td>
    </tr>
  );
};

export default BasicOptionRow;
