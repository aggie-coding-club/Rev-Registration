import * as React from 'react';
import { Typography, Select, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import * as styles from './SectionSelect.css';
import { SectionFilter } from '../../../../../../types/CourseCardOptions';

type OptionType = 'honors' | 'remote' | 'asynchronous' | 'mcallen';

interface BasicOptionRowProps {
    id: number;
    value: OptionType;
    label: string;
    setIsFiltering?: (a: boolean) => void;
}

const defaults: Record<OptionType, SectionFilter> = {
  honors: SectionFilter.NO_PREFERENCE,
  remote: SectionFilter.NO_PREFERENCE,
  asynchronous: SectionFilter.NO_PREFERENCE,
  mcallen: SectionFilter.EXCLUDE,
};

/**
 * Renders one row in the BasicSelect table
 * @param props include id of the course card and value, which should be the name of the
 * option selected by this row, formatted as it is found in the Redux course cards
 */
const BasicOptionRow: React.FC<BasicOptionRowProps> = ({
  id, value, label, setIsFiltering,
}) => {
  const option = useSelector<RootState, SectionFilter>(
    (state) => state.termData.courseCards[id][value] ?? defaults[value],
  );
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <Typography variant="body1" style={{ paddingRight: 8 }} id={`${value}-${id}`}>
          {`${label}:`}
        </Typography>
      </td>
      <td>
        <Select
          variant="outlined"
          value={option}
          classes={{ root: styles.selectRoot, selectMenu: styles.selectMenu }}
          labelId={`${value}-${id}`}
          inputProps={{ 'aria-label': label }}
          onChange={(evt): void => {
            // async so as to not freeze screen
            setTimeout(() => {
              // notify SectionSelect to show loading indicator
              if (setIsFiltering) setIsFiltering(true);
              dispatch(updateCourseCard(id, { [value]: evt.target.value }));
            }, 0);
          }}
        >
          <MenuItem value={SectionFilter.NO_PREFERENCE}>No Preference</MenuItem>
          <MenuItem value={SectionFilter.EXCLUDE}>Exclude</MenuItem>
          <MenuItem value={SectionFilter.ONLY}>Only</MenuItem>
        </Select>
      </td>
    </tr>
  );
};

export default BasicOptionRow;
