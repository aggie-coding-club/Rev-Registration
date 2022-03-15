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
    label: 'Honors' | 'Remote' | 'No Meeting Times' | 'McAllen';
    onFilter?: (a: boolean) => void;
}

const defaultFilters: Record<OptionType, SectionFilter> = {
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
  id, value, label, onFilter,
}) => {
  const option = useSelector<RootState, string>(
    (state) => state.termData.courseCards[id][value] || defaultFilters[value],
  );
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <Typography variant="body1" style={{ paddingRight: 8 }} id={`${value}-${id}`}>
          {`${label}:`}
        </Typography>
      </td>
      <td className={styles.optionValueSelect}>
        <Select
          variant="outlined"
          value={option}
          classes={{ root: styles.selectRoot, selectMenu: styles.selectMenu }}
          labelId={`${value}-${id}`}
          inputProps={{ 'aria-label': label }}
          onChange={(evt): void => {
            if (onFilter) onFilter(true);
            dispatch(updateCourseCard(id, { [value]: evt.target.value as string }));
            if (onFilter) onFilter(false);
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
