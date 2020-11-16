import {
  ListItemText, Divider, Tooltip, Typography, Checkbox, ListItem, ListItemIcon,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toggleSelected } from '../../../../../../redux/actions/courseCards';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import Meeting, { MeetingType, MeetingTypeDescription } from '../../../../../../types/Meeting';
import { formatTime } from '../../../../../../utils/timeUtil';
import * as styles from './SectionSelect.css';

interface SectionInfoProps {
    sectionData: SectionSelected;
    courseCardId: number;
    secIdx: number;
    addInstructorLabel: boolean;
    isLastSection: boolean;
}

const SectionInfo: React.FC<SectionInfoProps> = ({
  sectionData, courseCardId, secIdx, isLastSection,
}) => {
  const { section, meetings, selected } = sectionData;
  const dispatch = useDispatch();

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

  // builds a div containing the section's number and available/max enrollment
  const remainingSeats = section.maxEnrollment - section.currentEnrollment;
  const remainingSeatsColor = remainingSeats > 0 ? 'black' : 'red';
  // show section number and remaining seats if this is the first meeting for a section
  const sectionHeader = (
    <Typography className={styles.denseListItem} component="div" style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {section.sectionNum}
      </div>
      <div
        style={{ color: remainingSeatsColor, textAlign: 'right', flex: 3 }}
      >
        {`${remainingSeats}/${section.maxEnrollment} seats left`}
      </div>
    </Typography>
  );

  // adds a tooltip for meeting types that aren't very obvious ex -> INS, PRL, etc.
  const formatMeetingType = (mtg: Meeting): JSX.Element | string => {
    const meetingTypeDescription = MeetingTypeDescription.get(mtg.meetingType);
    if (meetingTypeDescription) {
      return (
        <Tooltip title={meetingTypeDescription} arrow placement="bottom" PopperProps={{ disablePortal: true }}>
          <span className={styles.meetingType}>{MeetingType[mtg.meetingType]}</span>
        </Tooltip>
      );
    }
    return MeetingType[mtg.meetingType];
  };

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <React.Fragment key={mtg.id}>
      {showSectionNum ? sectionHeader : null}
      <Typography className={`${styles.denseListItem} ${styles.meetingInfoWrapper}`} color="textSecondary" component="div">
        <div>
          <div>{formatMeetingType(mtg)}</div>
          <div>{mtg.building || 'ONLINE'}</div>
        </div>
        <div>
          <div>{formatMeetingDays(mtg)}</div>
          <div>{getMeetingTimeText(mtg)}</div>
        </div>
      </Typography>
    </React.Fragment>
  );

  // filters and then builds UI elements for the meetings that match this section
  const meetingRows = filterDuplicateMeetings(
    meetings.filter((mtg) => mtg.section.id === section.id),
  ).map((mtg, mtgIdx) => renderMeeting(mtg, mtgIdx === 0));


  // makes a list of the meetings in this section, along with one checkbox for all of them
  return (
    <ListItem
      onClick={(): void => { dispatch(toggleSelected(courseCardId, secIdx)); }}
      className={`${styles.noBottomSpace} ${styles.indentForCheckbox}`}
      dense
      disableGutters
      button
      component="li"
    >
      <ListItemIcon className={styles.myListItemIcon}>
        <Checkbox
          checked={selected}
          value={selected ? 'on' : 'off'}
          color="primary"
          size="small"
          className={styles.myIconButton}
        />
      </ListItemIcon>
      <ListItemText disableTypography className={styles.noBottomSpace}>
        <div className={styles.sectionDetailsTable}>
          {meetingRows}
        </div>
        {!isLastSection && <Divider className={styles.addBottomSpace} />}
      </ListItemText>
    </ListItem>
  );
};

const propsAreEqual = (
  prevProps: React.PropsWithChildren<SectionInfoProps>,
  nextProps: React.PropsWithChildren<SectionInfoProps>,
): boolean => prevProps.sectionData.selected === nextProps.sectionData.selected
  && prevProps.courseCardId === nextProps.courseCardId;

export default React.memo(SectionInfo, propsAreEqual);
