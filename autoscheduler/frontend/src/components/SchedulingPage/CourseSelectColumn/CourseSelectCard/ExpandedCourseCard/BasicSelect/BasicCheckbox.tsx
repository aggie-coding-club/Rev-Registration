import * as React from 'react';
import { Typography, Checkbox } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';

interface BasicCheckboxProps {
    id: number;
    value: 'includeFull';
    label: 'Include Full Sections';
}

/**
 * Renders one row in the BasicSelect table
 * @param props include id of the course card and value, which should be the name of the
 * option selected by this row, formatted as it is found in the Redux course cards
 */
const BasicCheckbox: React.FC<BasicCheckboxProps> = ({ id, value, label }) => {
  const includeFull = useSelector<RootState, boolean>(
    (state) => state.courseCards[id][value] || false,
  );
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <Typography variant="body1" style={{ paddingRight: 8 }}>
          {`${label}:`}
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
  );
};

export default BasicCheckbox;
