import {
  Button, Menu, MenuItem, Typography, Select,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import CollapseIcon from '@material-ui/icons/ExpandLess';
import { SectionFilter } from '../../../../../../types/CourseCardOptions';
import * as styles from '../../../../../LandingPage/SelectTerm/SelectTerm.css';
import * as menuStyles from '../BasicSelect/BasicSelect.css';
import * as sectionStyles from './SectionSelect.css';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import { RootState } from '../../../../../../redux/reducer';

interface SectionFiltersProps {
  id: number;
}

const courseCardFields = new Map<string, string>([
  ['Honors', 'filterHonors'],
  ['Remote', 'filterRemote'],
  ['No Meeting Times', 'filterAsynchronous'],
]);

const SectionFilters: React.FC<SectionFiltersProps> = ({ id }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const filterStates = useSelector<RootState, Map<string, SectionFilter>>((state) => new Map([
    ['Honors', state.termData.courseCards[id].filterHonors],
    ['Remote', state.termData.courseCards[id].filterRemote],
    ['No Meeting Times', state.termData.courseCards[id].filterAsynchronous],
  ]));
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (option: string): void => {
    dispatch(updateCourseCard(id, {
      [courseCardFields.get(option)]: SectionFilter.ONLY,
    }));
    setAnchorEl(null);
  };
  const options = [...filterStates.keys()];

  const openFilterHandle = (
    <div
      className={sectionStyles.filterHandle}
      onClick={(): void => setExpanded(!expanded)}
      onKeyPress={(): void => setExpanded(!expanded)}
      role="button"
      tabIndex={0}
    >
      <CollapseIcon />
      <Typography>
        {expanded ? 'Show ' : 'Hide '}
        Filters
      </Typography>
      <div className={sectionStyles.filterHandleBar} />
    </div>
  );

  const filterRows: JSX.Element[] = [];
  filterStates.forEach((val, key) => {
    if (val !== undefined && val !== SectionFilter.NO_PREFERENCE) {
      filterRows.push(
        <tr>
          <td>
            <Typography variant="body1" style={{ paddingRight: 8 }} id={`${key}-${id}`}>
              {`${key}:`}
            </Typography>
          </td>
          <td>
            <Select
              variant="outlined"
              value={val}
              classes={{ root: menuStyles.selectRoot, selectMenu: menuStyles.selectMenu }}
              labelId={key}
              onChange={(evt): void => {
                dispatch(updateCourseCard(id, {
                  [courseCardFields.get(key)]: evt.target.value as string,
                }));
              }}
            >
              <MenuItem value={SectionFilter.EXCLUDE}>Exclude</MenuItem>
              <MenuItem value={SectionFilter.ONLY}>Only</MenuItem>
            </Select>
          </td>
          <td>
            <DeleteIcon
              style={{ cursor: 'pointer' }}
              onClick={(): void => {
                dispatch(updateCourseCard(id, {
                  [courseCardFields.get(key)]: SectionFilter.NO_PREFERENCE,
                }));
              }}
            />
          </td>
        </tr>,
      );
    }
  });

  return (
    <>
      {openFilterHandle}
      {expanded || (
        <>
          <Button
            variant="text"
            size="small"
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup
            onClick={handleClick}
            style={{ width: 'fit-content' }}
          >
            + Add Filter
          </Button>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              className: styles.menuPaper,
            }}
          >
            {
              /* renders a menu item for only and exclude */
              options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === '' /* TODO */}
                  onClick={(): void => handleClose(option)}
                >
                  {option}
                </MenuItem>
              ))
            }
          </Menu>
          <table>{filterRows}</table>
          <div className={sectionStyles.filterHandleBottomBar} />
        </>
      )}
    </>
  );
};

export default SectionFilters;
