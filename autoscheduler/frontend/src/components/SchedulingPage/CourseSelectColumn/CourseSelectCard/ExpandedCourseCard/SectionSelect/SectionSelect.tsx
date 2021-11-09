import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List, Typography, Checkbox, Button, Menu, MenuItem, IconButton,
  Tooltip,
} from '@material-ui/core';
import { ToggleButton, Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import SortIcon from '@material-ui/icons/Sort';
import { ArrowDownward as ArrowDownwardIcon } from '@material-ui/icons';
import { toggleSelectedAll, updateSortType } from '../../../../../../redux/actions/courseCards';
import {
  SortType, SortTypeLabels, DefaultSortTypeDirections, CourseCardOptions,
} from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import ProfessorGroup from './ProfessorGroup';
import SmallFastProgress from '../../../../../SmallFastProgress';
import BasicOptionRow from './BasicOptionRow';
import BasicCheckbox from './BasicCheckbox';
import shouldIncludeSection from '../../../../../../utils/filterSections';

interface SectionSelectProps {
  id: number;
  onHeightChange?: () => any;
}

interface SortState {
  sortMenuAnchor: HTMLElement;
  frontendSortType: SortType;
  frontendSortIsDescending: boolean;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id, onHeightChange }): JSX.Element => {
  const courseCard = useSelector<RootState, CourseCardOptions>((state) => (
    state.termData.courseCards[id]
  ));
  // Frontend sorting properties
  const [sortState, setSortState] = React.useState<SortState>({
    sortMenuAnchor: null,
    frontendSortType: courseCard.sortType,
    frontendSortIsDescending: courseCard.sortIsDescending,
  });

  // to show a loading indicator when filtering is in progress
  const [isFiltering, setIsFiltering] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (!isFiltering && onHeightChange) onHeightChange();
  }, [isFiltering, onHeightChange]);

  React.useEffect(() => {
    // unlike sorting, for filtering the speed problem is rendering the new items
    //  the setTimeout makes it so it renders loading circle, then applies this state change
    //  this makes it so the loading indicator works as expected,
    //  without the settimeout it changes state first,
    //  thus never rendering the loading circle and freezing the screen
    if (isFiltering) setTimeout(() => setIsFiltering(false), 0);
  }, [courseCard, isFiltering]);

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
    collapseContainer: {
      display: 'flex',
    },
  });
  const classes = useStyles();

  // show placeholder text if there are no sections
  if (!courseCard.course && courseCard.sections.length === 0) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary" variant="body1">
        Select a course to show available options
      </Typography>
    );
  }
  if (courseCard.sections.length === 0) {
    return (
      <Typography className={styles.placeholderText} color="textSecondary" variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  let allSelected = true;
  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = 0;
    // since we will be filtering, we need to store the index somewhere
    return courseCard.sections
      // Remember original index of sections so that ProfessorGroup uses the correct indices
      .map((sectionData, originalIdx) => ({ sectionData, originalIdx }))
      .filter(({ sectionData }) => shouldIncludeSection(courseCard, sectionData))
      .map(({ sectionData, originalIdx }, filteredIdx, filteredSections) => {
        const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
        if (firstInProfGroup) currProfGroupStart = originalIdx;

        lastProf = sectionData.section.instructor.name;
        lastHonors = sectionData.section.honors;
        allSelected = allSelected && sectionData.selected;

        // Check prof group by index in filtered array, NOT courseCard.sections
        const lastInProfGroup = (
          lastProf !== filteredSections[filteredIdx + 1]?.sectionData.section.instructor.name
          || lastHonors !== filteredSections[filteredIdx + 1]?.sectionData.section.honors
        );

        // all sections in a group will be added at the same time
        if (!lastInProfGroup) return null;

        return (
          <ProfessorGroup
            sectionRange={[currProfGroupStart, originalIdx + 1]}
            courseCardId={id}
            zIndex={courseCard.sections.length - originalIdx}
            key={`${lastProf + lastHonors} ${sectionData.section.sectionNum}`}
          />
        );
      });
  };

  // filtering
  // generates available filter options
  const filterOptions = (
    <table className={styles.filterOptionTable}>
      <tbody>
        <BasicCheckbox id={id} value="includeFull" label="Include Full Sections" onFilter={setIsFiltering} />
        { courseCard.hasHonors
          ? <BasicOptionRow id={id} value="honors" label="Honors" onFilter={setIsFiltering} />
          : null }
        { courseCard.hasRemote
          ? <BasicOptionRow id={id} value="remote" label="Remote" onFilter={setIsFiltering} />
          : null }
        { courseCard.hasAsynchronous
          ? <BasicOptionRow id={id} value="asynchronous" label="No Meeting Times" onFilter={setIsFiltering} />
          : null }
      </tbody>
    </table>
  );

  // sorting
  const handleChange = (newSortType: SortType): void => {
    setSortState({
      sortMenuAnchor: null,
      frontendSortType: newSortType,
      frontendSortIsDescending: DefaultSortTypeDirections.get(newSortType),
    });
    // async so it doesn't freeze the screen
    setTimeout(() => {
      dispatch(updateSortType(id, newSortType, DefaultSortTypeDirections.get(newSortType)));
    }, 0);
  };
  const sortMenu = (
    <>
      <div className={styles.sortMenuPosition}>
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
          <SortIcon className={styles.sortTypeMenuButtonIcon} color="action" />
          <span className={styles.sortByText} data-testid="sort-by-label">
            SORT:
            &nbsp;
            {SortTypeLabels.get(sortState.frontendSortType)}
          </span>
        </Button>
        <Tooltip title={`${sortState.frontendSortIsDescending ? 'Descending' : 'Ascending'}`}>
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
                dispatch(updateSortType(id, courseCard.sortType, newIsDescending));
              }, 0);
            }}
          >
            <ArrowDownwardIcon
              className={`${styles.sortOrderButtonIcon}${sortState.frontendSortIsDescending ? '' : ` ${styles.sortOrderButtonIconAscending}`}`}
              color="action"
            />
          </IconButton>
        </Tooltip>
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
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {Array.from(SortTypeLabels.keys()).map(
          (val) => (
            val === SortType.HONORS && !courseCard.sections.some((sect) => sect.section.honors)
              ? (null)
              : (
                <MenuItem
                  onClick={(): void => { handleChange(val); }}
                  selected={courseCard.sortType === val}
                  key={`${val} Button`}
                >
                  {SortTypeLabels.get(val)}
                </MenuItem>
              )
          ),
        )}
      </Menu>
    </>
  );

  // Select All
  // pre-making list so we can tell if the select-all checkbox should be checked
  const list = makeList();

  const selectAll = (
    <ToggleButton classes={{ root: classes.rootToggleButton }} value="select-all" aria-label="select all" onChange={(): void => { dispatch(toggleSelectedAll(id, !allSelected)); }}>
      <Checkbox
        checked={allSelected}
        value={(allSelected) ? 'all on' : 'all off'}
        color="primary"
        size="small"
        disableRipple
        classes={{ root: classes.rootCheckbox }}
      />
      <span className={styles.selectAllText}>
        SELECT ALL
      </span>
    </ToggleButton>
  );

  // div of options for easier version control
  const sectionSelectOptions = list.length ? (
    <div className={styles.selectAllSortByContainer}>
      {selectAll}
      {sortMenu}
    </div>
  ) : undefined;

  let sectionContent: JSX.Element;
  // Show sections if sort + filters have been applied
  if (sortState.frontendSortType === courseCard.sortType
    && sortState.frontendSortIsDescending === courseCard.sortIsDescending
    && !isFiltering
  ) {
    sectionContent = list.length > 0 ? (
      <List disablePadding className={styles.sectionRows}>
        {list}
      </List>
    ) : (
      <div className={styles.warning}>
        <Alert severity="warning">No sections match all your filters</Alert>
      </div>
    );
  } else {
    // Content is loading: show loading if there are enough sections to not make it look weird
    sectionContent = list.length >= 5 ? (
      <div id={styles.centerProgress}>
        <SmallFastProgress />
        <Typography>
          {isFiltering ? 'Filtering' : 'Sorting'}
          {' '}
          sections...
        </Typography>
      </div>
    ) : undefined;
  }

  // don't show loading for small number of sections since its almost instant
  // and causes ugly flashing
  return (
    <>
      <div className={styles.staticHeightContent}>
        <Typography variant="subtitle1" color="textSecondary" className={styles.subTitle}>
          Filters
        </Typography>
        {filterOptions}
        <Typography variant="subtitle1" color="textSecondary" className={styles.subTitle}>
          Sections
        </Typography>
        {sectionSelectOptions}
      </div>
      <div className={styles.dynamicHeightContent}>
        {sectionContent}
      </div>
    </>
  );
};

export default SectionSelect;
