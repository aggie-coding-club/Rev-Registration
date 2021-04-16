import {
  ListItemText, Divider, Typography, Checkbox, ListItem, ListItemIcon,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toggleSelected } from '../../../../../../redux/actions/courseCards';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import Meeting from '../../../../../../types/Meeting';
import { formatTime } from '../../../../../../utils/timeUtil';
import meetingBuilding from '../../../../../../utils/meetingBuilding';
import meetingsForSection from '../../../../../../utils/meetingsForSection';
import MeetingTypeDisplay from './MeetingType/MeetingTypeDisplay';
import InstructionalMethodIcon from './InstructionalMethodIcon/InstructionalMethodIcon';
import * as styles from './Select.css';

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

  // builds a div containing the section's number and available/max enrollment
  const remainingSeats = section.maxEnrollment - section.currentEnrollment;
  const remainingSeatsColor = remainingSeats > 0 ? 'black' : 'red';
  // show section number and remaining seats if this is the first meeting for a section
  const sectionHeader = (
    <Typography className={styles.denseListItem} component="div" style={{ display: 'flex', gridColumn: '1 / -1' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {section.sectionNum}
        &nbsp;
        <InstructionalMethodIcon instructionalMethod={section.instructionalMethod} />
      </div>
      <div
        style={{ flex: 3, color: remainingSeatsColor, textAlign: 'right' }}
      >
        {`${remainingSeats}/${section.maxEnrollment} seats left`}
      </div>
    </Typography>
  );

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <React.Fragment key={mtg.id}>
      {showSectionNum ? sectionHeader : null}
      <Typography className={`${styles.denseListItem} ${styles.meetingInfoWrapper}`} color="textSecondary" component="div">
        <div><MeetingTypeDisplay meeting={mtg} /></div>
        <div>{meetingBuilding(mtg)}</div>
        <div className={styles.meetingDays}>{formatMeetingDays(mtg)}</div>
        <div className={styles.meetingTime}>{getMeetingTimeText(mtg)}</div>
      </Typography>
    </React.Fragment>
  );

  // filters and then builds UI elements for the meetings that match this section
  const meetingRows = meetingsForSection(section, meetings).map((mtg, mtgIdx) => (
    renderMeeting(mtg, mtgIdx === 0)
  ));

  // makes a list of the meetings in this section, along with one checkbox for all of them
  return (
    <ListItem
      onClick={(): void => { dispatch(toggleSelected(courseCardId, secIdx)); }}
      className={`${styles.noExtraSpace} ${styles.indentForCheckbox}`}
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
      <ListItemText disableTypography className={styles.noExtraSpace}>
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
  && prevProps.courseCardId === nextProps.courseCardId
  && prevProps.addInstructorLabel === nextProps.addInstructorLabel
  && prevProps.secIdx === nextProps.secIdx;

export default React.memo(SectionInfo, propsAreEqual);
