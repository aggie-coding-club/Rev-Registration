import * as React from 'react';
import {
  List, ListItemText, ListItem, Checkbox, ListItemIcon, Typography, ListSubheader,
  Tooltip, Divider,
} from '@material-ui/core';
import HonorsIcon from '@material-ui/icons/School';
import { useSelector, useDispatch } from 'react-redux';
import Meeting, { MeetingType } from '../../../../../../types/Meeting';
import Section from '../../../../../../types/Section';
import { formatTime } from '../../../../../../utils/timeUtil';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import GradeDist from './GradeDist/GradeDist';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  const dispatch = useDispatch();

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  const toggleSelected = (i: number): void => {
    dispatch(updateCourseCard(id, {
      sections: sections.map((sec, idx) => (idx !== i ? sec : {
        section: sec.section,
        selected: !sec.selected,
        meetings: sec.meetings,
      })),
    }));
  };

  const formatMeetingDays = (meeting: Meeting): string => {
    const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
    return meeting.meetingDays.reduce((acc, curr, idx) => (curr ? acc + DAYS_OF_WEEK[idx] : acc), '');
  };

  const getMeetingTimeText = (mtg: Meeting): string => {
    if (mtg.startTimeHours === 0) {
      // If the time is 00:00, then it's meeting time is not applicable
      return 'N/A';
    }

    // Returns it in the format 12:00 - 1:00
    return `${formatTime(mtg.startTimeHours, mtg.startTimeMinutes)}
      - ${formatTime(mtg.endTimeHours, mtg.endTimeMinutes)}`;
  };

  /**
   * Accepts an array of meetings and returns a filtered array without duplicate meetings.
   * Meetings are considered to be duplicates if they are of the same type, meet on the same days,
   * and start at the same time. Meetings that are the same by all of these criteria but
   * differ only in the end times will still be considered duplicates
   * @param arr
   */
  const filterDuplicateMeetings = (arr: Meeting[]): Meeting[] => {
    // helper function to merge two meetings
    const mergeMeetings = (mtg1: Meeting, mtg2: Meeting): Meeting => {
      if (!mtg2) return mtg1;

      // choose the later end time
      const [laterEndHours, laterEndMinutes] = mtg2.endTimeHours > mtg1.endTimeHours
        ? [mtg2.endTimeHours, mtg2.endTimeMinutes]
        : [mtg1.endTimeHours, mtg1.endTimeMinutes];
      // merge the days array by logical OR of each element
      const days = mtg1.meetingDays.map((hasMeeting, idx) => hasMeeting || mtg2.meetingDays[idx]);
      return {
        ...mtg1,
        endTimeHours: laterEndHours,
        endTimeMinutes: laterEndMinutes,
        meetingDays: days,
      };
    };

    // add all meetings to a map, then get the values of the map
    const uniqueMeetings = new Map<string, Meeting>();
    arr.forEach((mtg) => {
      const key = `${mtg.meetingType}${mtg.startTimeHours}${mtg.startTimeMinutes}`;
      uniqueMeetings.set(key, mergeMeetings(mtg, uniqueMeetings.get(key)));
    });
    return [...uniqueMeetings.values()];
  };

  // returns a div containing the section's number and available/max enrollment
  const createSectionHeader = (section: Section): JSX.Element => {
    const remainingSeats = section.maxEnrollment - section.currentEnrollment;
    const remainingSeatsColor = remainingSeats > 0 ? 'black' : 'red';
    // show section number and remaining seats if this is the first meeting for a section
    return (
      <Typography className={styles.denseListItem} component="tr">
        <td>
          {section.sectionNum}
        </td>
        <td
          style={{ color: remainingSeatsColor, textAlign: 'right' }}
          colSpan={3}
        >
          {`${remainingSeats}/${section.maxEnrollment} seats left`}
        </td>
      </Typography>
    );
  };

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <React.Fragment key={mtg.id}>
      {showSectionNum ? createSectionHeader(mtg.section) : null }
      <Typography className={styles.denseListItem} color="textSecondary" component="tr">
        <td>
          <span style={{ textDecorationLine: 'underline' }}>{MeetingType[mtg.meetingType]}</span>
        </td>
        <td>{mtg.building || 'ONLINE'}</td>
        <td>{formatMeetingDays(mtg)}</td>
        <td>{getMeetingTimeText(mtg)}</td>
      </Typography>
    </React.Fragment>
  );

  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    return sections.map(({ section, selected, meetings }, secIdx) => {
      const makeNewGroup = lastProf !== section.instructor.name || lastHonors !== section.honors;
      const instructorLabel = makeNewGroup
        ? (
          <>
            <ListSubheader disableGutters className={styles.listSubheaderDense}>
              <div className={styles.nameHonorsIcon}>
                {section.instructor.name}
                {section.honors ? (
                  <Tooltip title="Honors" placement="right">
                    <HonorsIcon data-testid="honors" />
                  </Tooltip>
                ) : null}
              </div>
              {section.grades
                ? <GradeDist grades={section.grades} />
                : (
                  <div className={styles.noGradesAvailable}>
                    No grades available
                  </div>
                )}
            </ListSubheader>
            <div className={styles.dividerContainer}>
              <Divider />
            </div>
          </>
        )
        : null;
      lastProf = section.instructor.name;
      lastHonors = section.honors;

      // filters and then builds UI elements for the meetings that match this section
      const meetingRows = filterDuplicateMeetings(
        meetings.filter((mtg) => mtg.section.id === section.id),
      ).map((mtg, mtgIdx) => renderMeeting(mtg, mtgIdx === 0));

      // makes a list of the meetings in this section, along with one checkbox for all of them
      const sectionDetails = (
        <ListItem
          onClick={(): void => toggleSelected(secIdx)}
          dense
          disableGutters
          button
        >
          <ListItemIcon className={styles.myListItemIcon}>
            <Checkbox
              checked={selected}
              color="primary"
              size="small"
              className={styles.myIconButton}
            />
          </ListItemIcon>
          <ListItemText disableTypography>
            <table className={styles.sectionDetailsTable}>
              <colgroup>
                <col width="15%" />
                <col width="20%" />
                <col width="20%" />
                <col width="45%" />
              </colgroup>
              <tbody>
                {meetingRows}
              </tbody>
            </table>
          </ListItemText>
        </ListItem>
      );
      return (
        <React.Fragment key={section.sectionNum}>
          {instructorLabel}
          {sectionDetails}
        </React.Fragment>
      );
    });
  };

  return (
    <List disablePadding className={styles.sectionRows}>
      {makeList()}
    </List>
  );
};

export default SectionSelect;
