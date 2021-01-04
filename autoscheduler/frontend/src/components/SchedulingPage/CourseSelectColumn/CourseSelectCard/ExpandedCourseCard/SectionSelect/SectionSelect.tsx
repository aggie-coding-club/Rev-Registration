import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List, Typography, Checkbox, Button, Menu, MenuItem, IconButton,
} from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import SortIcon from '@material-ui/icons/Sort';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { toggleSelectedAll, updateSortType } from '../../../../../../redux/actions/courseCards';
import { SectionSelected, SortType, SortTypeLabels } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import SectionInfo from './SectionInfo';
import SmallFastProgress from '../../../../../SmallFastProgress';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  // to show loading symbol when needed
  const reduxSortType = useSelector<RootState, SortType>(
    (state) => state.courseCards[id].sortType,
  );
  const reduxSortIsDescending = useSelector<RootState, boolean>(
    (state) => state.courseCards[id].sortIsDescending,
  );
  // for sorting, in a map so you can set multiple without too many rerenders
  const [sortState, setSortState] = React.useState<{
    sortMenuAnchor: null | HTMLElement;
    frontendSortType: SortType;
    frontendSortIsDescending: boolean;
  }>({
    sortMenuAnchor: null,
    frontendSortType: reduxSortType,
    frontendSortIsDescending: reduxSortIsDescending,
  });

  // for change sort type and toggle selected all
  const dispatch = useDispatch();

  // for select all
  // override certain material ui styles
  const useStyles = makeStyles({
    rootToggleButton: {
      border: 'none',
      textAlign: 'left',
      margin: '5px 0',
      padding: '0 10px 0 0',
      fontSize: '86%',
      height: '35px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.66)',
    },
    rootCheckbox: {
      padding: '0 3px 0 0',
    },
  });
  const classes = useStyles();

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary" variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  let numSelected = 0;
  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = 0;
    return sections.map((sectionData, secIdx) => {
      const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
      if (firstInProfGroup) currProfGroupStart = secIdx;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;
      numSelected += (sectionData.selected ? 1 : 0);

      const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

      // all sections in a group will be added at the same time
      if (!lastInProfGroup) return null;

      return (
        <ul key={`${lastProf + lastHonors} ${secIdx + 1}`} className={styles.noStartPadding}>
          {sections.slice(currProfGroupStart, secIdx + 1).map((iterSecData, offset) => (
            <SectionInfo
              secIdx={currProfGroupStart + offset}
              courseCardId={id}
              sectionData={iterSecData}
              addInstructorLabel={offset === 0}
              isLastSection={currProfGroupStart + offset === secIdx}
              key={iterSecData.section.id}
            />
          ))}
        </ul>
      );
    });
  };

  // sorting
  const handleChange = (newSortType: SortType): void => {
    setSortState({
      sortMenuAnchor: null,
      frontendSortType: newSortType,
      frontendSortIsDescending: true,
    });
    // async so it doesn't freeze the screen
    setTimeout(() => {
      dispatch(updateSortType(id, newSortType, true));
    }, 0);
  };
  const sortMenu = (
    <>
      <div className={styles.sortMenuPosition}>
        <IconButton
          color="default"
          className={styles.sortOrderButton}
          aria-label="reverse-sort-order"
          aria-haspopup="true"
          component="div"
          onClick={(): void => {
            // assert that the two are the same
            const newIsDescending = !sortState.frontendSortIsDescending;

            setSortState({
              ...sortState,
              frontendSortIsDescending: newIsDescending,
            });
            // async so doesn't freeze screen
            setTimeout(() => {
              dispatch(updateSortType(id, reduxSortType, newIsDescending));
            }, 0);
          }}
        >
          <ArrowDropDownIcon
            className={`${styles.sortOrderButtonIcon}${sortState.frontendSortIsDescending ? '' : ` ${styles.sortOrderButtonIconAscending}`}`}
            color="action"
          />
        </IconButton>
        <Button
          color="default"
          className={styles.sortTypeMenuButton}
          aria-label="sort-menu"
          aria-haspopup="true"
          component="div"
          onClick={(event: any): void => {
            setSortState({ ...sortState, sortMenuAnchor: event.currentTarget });
          }}
        >
          SORT BY
          <SortIcon className={styles.sortTypeMenuButtonIcon} color="action" />
        </Button>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={sortState.sortMenuAnchor}
        keepMounted
        open={Boolean(sortState.sortMenuAnchor)}
        variant="menu"
        onClose={(): void => {
          setSortState({ ...sortState, sortMenuAnchor: null });
        }}
      >
        {Array.from(SortTypeLabels.keys()).map((val) => (
          <MenuItem
            onClick={(): void => { handleChange(val); }}
            selected={reduxSortType === val}
            key={`${val} Button`}
          >
            {SortTypeLabels.get(val)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );

  // Select All
  // pre-making list so we can tell if the select-all checkbox should be checked
  const list = makeList();
  const allSelected: boolean = numSelected === sections.length;
  const selectAll = (
    <ToggleButton classes={{ root: classes.rootToggleButton }} value="select-all" aria-label="select all" onChange={(): void => { dispatch(toggleSelectedAll(id, !allSelected)); }}>
      <Checkbox
        checked={allSelected}
        value={(allSelected) ? 'allOn' : 'allOff'}
        color="primary"
        size="small"
        disableRipple
        classes={{ root: classes.rootCheckbox }}
      />
        SELECT ALL
    </ToggleButton>
  );

  // div of options for easier version control
  const sectionSelectOptions = (
    <div>
      {selectAll}
      {sortMenu}
    </div>
  );

  // don't show loading for small number of sections since its almost instant
  // and causes ugly flashing
  return (
    <>
      {sectionSelectOptions}
      {((sortState.frontendSortType === reduxSortType
        && sortState.frontendSortIsDescending === reduxSortIsDescending)
        || sections.length <= 4) ? (
          <List disablePadding className={styles.sectionRows}>
            {list}
          </List>
        ) : (
          <div id={styles.centerProgress}>
            <SmallFastProgress />
            <Typography>
              Sorting sections...
            </Typography>
          </div>
        )}
    </>
  );
};

export default SectionSelect;
