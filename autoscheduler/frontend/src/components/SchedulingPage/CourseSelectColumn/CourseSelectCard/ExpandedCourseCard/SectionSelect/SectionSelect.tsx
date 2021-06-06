import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  List, Typography, Checkbox, Button, Menu, MenuItem, IconButton,
  Tooltip, ExpansionPanel as ExpansionPanelBase, ExpansionPanelSummary as ExpansionPanelSummaryBase,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { ToggleButton, Alert } from '@material-ui/lab';
import { makeStyles, withStyles } from '@material-ui/styles';
import SortIcon from '@material-ui/icons/Sort';
import { ArrowDownward as ArrowDownwardIcon, ExpandMore } from '@material-ui/icons';
import { toggleSelectedAll, updateSortType } from '../../../../../../redux/actions/courseCards';
import {
  SectionSelected, SortType, SortTypeLabels, DefaultSortTypeDirections, SectionFilter,
} from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import ProfessorGroup from './ProfessorGroup';
import SmallFastProgress from '../../../../../SmallFastProgress';
import BasicOptionRow from './BasicOptionRow';
import BasicCheckbox from './BasicCheckbox';

interface SectionSelectProps {
  id: number;
}

const ExpansionPanel = withStyles({
  root: {
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  expanded: {},
})(ExpansionPanelBase);

const ExpansionPanelSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 36,
    '&$expanded': {
      minHeight: 36,
    },
  },
  content: {
    margin: '0',
    '&$expanded': {
      margin: '0',
    },
    overflow: 'hidden',
    // bar between arrow and title
    '&::after': {
      content: '""',
      height: 2,
      borderWidth: '6px 0 0 0',
      borderColor: 'transparent',
      borderStyle: 'solid',
      boxShadow: 'inset 0 0 10px 10px #919191',
      margin: 'auto -14px auto 12px',
      flexGrow: 1,
    },
  },
  expandIcon: {
    // the typography has a slight top margin
    marginTop: 6,
    padding: '4px 16px',
  },
  expanded: {},
})(ExpansionPanelSummaryBase);

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.termData.courseCards[id].sections,
  );
  // to show loading symbol when needed
  const reduxSortType = useSelector<RootState, SortType>(
    (state) => state.termData.courseCards[id].sortType,
  );
  const reduxSortIsDescending = useSelector<RootState, boolean>(
    (state) => state.termData.courseCards[id].sortIsDescending,
  );
  // filters
  const hasHonors = useSelector<RootState, boolean>(
    (state) => state.termData.courseCards[id].hasHonors || false,
  );
  const hasRemote = useSelector<RootState, boolean>(
    (state) => state.termData.courseCards[id].hasRemote || false,
  );
  const hasAsynchronous = useSelector<RootState, boolean>(
    (state) => state.termData.courseCards[id].hasAsynchronous || false,
  );
  const honors = useSelector<RootState, SectionFilter>(
    (state) => state.termData.courseCards[id].honors as SectionFilter ?? SectionFilter.NO_PREFERENCE,
  );
  const remote = useSelector<RootState, SectionFilter>(
    (state) => state.termData.courseCards[id].remote as SectionFilter ?? SectionFilter.NO_PREFERENCE,
  );
  const asynchronous = useSelector<RootState, SectionFilter>(
    (state) => state.termData.courseCards[id].asynchronous as SectionFilter ?? SectionFilter.NO_PREFERENCE,
  );
  const includeFull = useSelector<RootState, boolean>(
    (state) => (state.termData.courseCards[id].includeFull ?? false),
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
    collapseContainer: {
      display: 'flex',
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

  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  let allSelected = true;
  const makeList = (): JSX.Element[] => {
    /**
     * Function to filter based off of selected filters.
     * We need to use this here and in professor group,
     * since professor group only gets a start and end index.
     */
    const filterSections = (sectionData: SectionSelected): boolean => {
      const toBool = (filter: SectionFilter | undefined, val: boolean): boolean => {
        if (!filter || filter === SectionFilter.NO_PREFERENCE) {
          return true;
        }
        return (filter === SectionFilter.ONLY) ? val : !val;
      };
      // filter by whatever
      const { section } = sectionData;

      return toBool(honors, section.honors)
        && toBool(remote, section.remote)
        && toBool(asynchronous, section.asynchronous)
        && ((section.currentEnrollment < section.maxEnrollment) || includeFull);
    };

    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = 0;
    // since we will be filtering, we need to store the index somewhere
    return sections
      .map((sectionData, secIdx) => ({ sectionData, secIdx })).filter(({ sectionData }) => filterSections(sectionData)).map(({ sectionData, secIdx }) => {
        const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
        if (firstInProfGroup) currProfGroupStart = secIdx;

        lastProf = sectionData.section.instructor.name;
        lastHonors = sectionData.section.honors;
        allSelected = allSelected && sectionData.selected;

        const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

        // all sections in a group will be added at the same time
        if (!lastInProfGroup) return null;

        return (
          <ProfessorGroup
            filterSections={filterSections}
            sectionRange={[currProfGroupStart, secIdx + 1]}
            courseCardId={id}
            key={`${lastProf + lastHonors} ${sectionData.section.sectionNum}`}
          />
        );
      });
  };

  // filtering
  // generates available filter options
  const filterOptions = (
    <table>
      <tbody>
        <BasicCheckbox id={id} value="includeFull" label="Include Full Sections" />
        { hasHonors
          ? <BasicOptionRow id={id} value="honors" label="Honors" />
          : null }
        { hasRemote
          ? <BasicOptionRow id={id} value="remote" label="Remote" />
          : null }
        { hasAsynchronous
          ? <BasicOptionRow id={id} value="asynchronous" label="No Meeting Times" />
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
          SORT BY
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
                dispatch(updateSortType(id, reduxSortType, newIsDescending));
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
      >
        {Array.from(SortTypeLabels.keys()).map(
          (val) => (val === SortType.HONORS && !sections.some((sect) => sect.section.honors)
            ? (null)
            : (
              <MenuItem
                onClick={(): void => { handleChange(val); }}
                selected={reduxSortType === val}
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
      <div className={styles.tableContainer}>
        <ExpansionPanel
          square
          className={styles.accordianRoot}
          defaultExpanded
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMore />}
            aria-controls="show-hide-filters"
            id="filters-panel"
            className={styles.accordianSummary}
          >
            <Typography variant="subtitle1" color="textSecondary" className={styles.subTitle}>
              Filters
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordianDetails}>
            {filterOptions}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      <div className={styles.tableContainer}>
        <ExpansionPanel
          square
          className={styles.accordianRoot}
          defaultExpanded
          TransitionProps={({ style: { display: 'flex' } })}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMore />}
            aria-controls="show-hide-section"
            id="sections-panel"
            className={styles.accordianSummary}
          >
            <Typography variant="subtitle1" color="textSecondary" className={styles.subTitle}>
              Sections
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={styles.accordianDetails}>
            <div className={styles.sectionsWrapper}>
              {list.length > 0 ? (
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
              ) : (
                <Alert severity="warning">No Sections Match All Your Filters</Alert>
              )}
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    </>
  );
};

export default SectionSelect;
