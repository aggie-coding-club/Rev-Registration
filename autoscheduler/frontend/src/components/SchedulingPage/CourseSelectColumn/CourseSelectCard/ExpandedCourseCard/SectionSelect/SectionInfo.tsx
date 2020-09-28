import {
  Checkbox, ListItem, ListItemIcon, ListItemText, Typography,
} from '@material-ui/core';
import * as React from 'react';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import Meeting, { MeetingType } from '../../../../../../types/Meeting';
import { formatTime } from '../../../../../../utils/timeUtil';
import * as styles from './SectionSelect.css';

interface SectionInfoProps {
  sectionData: SectionSelected;
  toggleSelected: (secId: number) => void;
}

const SectionInfo: React.FC<SectionInfoProps> = ({
  sectionData, toggleSelected,
}) => {
  const { section, meetings, selected } = sectionData;

  /**
   * Accepts an array of meetings and returns a filtered array without duplicate meetings.
   * Meetings are considered to be duplicates if they are of the same type, meet on the same
   * days, and start at the same time. Meetings that are the same by all of these criteria
   * but differ only in the end times will still be considered duplicates
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
      const days = mtg1.meetingDays.map(
        (hasMeeting, idx) => hasMeeting || mtg2.meetingDays[idx],
      );
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
  const createSectionHeader = (): JSX.Element => {
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

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <React.Fragment key={mtg.id}>
      {showSectionNum ? createSectionHeader() : null }
      <Typography className={styles.denseListItem} color="textSecondary" component="tr">
        <td>{MeetingType[mtg.meetingType]}</td>
        <td>{mtg.building || 'ONLINE'}</td>
        <td>{formatMeetingDays(mtg)}</td>
        <td>{getMeetingTimeText(mtg)}</td>
      </Typography>
    </React.Fragment>
  );

  // filters and then builds UI elements for the meetings that match this section
  const meetingRows = filterDuplicateMeetings(
    meetings.filter((mtg) => mtg.section.id === section.id),
  ).map((mtg, mtgIdx) => renderMeeting(mtg, mtgIdx === 0));

  return (
    <ListItem
      onClick={(): void => toggleSelected(section.id)}
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
};

export default SectionInfo;
