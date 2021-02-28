import {
  ListSubheader, ListItemText, Divider, Typography, Checkbox, ListItem, ListItemIcon,
} from '@material-ui/core';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { toggleSelected } from '../../../../../../redux/actions/courseCards';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import Meeting from '../../../../../../types/Meeting';
import formatMeetingDays from '../../../../../../utils/formatMeetingDays';
import meetingBuilding from '../../../../../../utils/meetingBuilding';
import meetingsForSection from '../../../../../../utils/meetingsForSection';
import meetingTimeText from '../../../../../../utils/meetingTimeText';
import GradeDist from './GradeDist/GradeDist';
import MeetingTypeDisplay from './MeetingType/MeetingTypeDisplay';
import InstructionalMethodIcon from './InstructionalMethodIcon/InstructionalMethodIcon';
import * as styles from './SectionSelect.css';
import HonorsIcon from '../../../../../Icons/HonorsIcon/HonorsIcon';

interface SectionInfoProps {
    sectionData: SectionSelected;
    courseCardId: number;
    secIdx: number;
    addInstructorLabel: boolean;
    isLastSection: boolean;
}

const SectionInfo: React.FC<SectionInfoProps> = ({
  sectionData, courseCardId, secIdx, addInstructorLabel, isLastSection,
}) => {
  const { section, meetings, selected } = sectionData;
  const dispatch = useDispatch();

  const instructorLabel = addInstructorLabel
    ? (
      <>
        <ListSubheader disableGutters className={styles.listSubheaderDense}>
          <div className={styles.listSubheaderContent}>
            <div className={styles.nameHonorsIcon}>
              {section.instructor.name}
              {section.honors ? <HonorsIcon /> : null}
            </div>
            <GradeDist grades={section.grades} />
          </div>
          <div className={styles.dividerContainer}>
            <Divider />
          </div>
        </ListSubheader>
      </>
    )
    : null;

  // builds a div containing the section's number and available/max enrollment
  const remainingSeats = section.maxEnrollment - section.currentEnrollment;
  const remainingSeatsColor = remainingSeats > 0 ? 'black' : 'red';
  // show section number and remaining seats if this is the first meeting for a section
  const sectionHeader = (
    <Typography className={styles.denseListItem} component="tr">
      <td>
        <span className={styles.sectionNameContainer}>
          {section.sectionNum}
          &nbsp;
          <InstructionalMethodIcon instructionalMethod={section.instructionalMethod} />
        </span>
      </td>
      <td
        style={{ color: remainingSeatsColor, textAlign: 'right' }}
        colSpan={3}
      >
        {`${remainingSeats}/${section.maxEnrollment} seats left`}
      </td>
    </Typography>
  );

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <React.Fragment key={mtg.id}>
      {showSectionNum ? sectionHeader : null}
      <Typography className={styles.denseListItem} color="textSecondary" component="tr">
        <td>
          <MeetingTypeDisplay meeting={mtg} />
        </td>
        <td>{meetingBuilding(mtg)}</td>
        <td>{formatMeetingDays(mtg)}</td>
        <td>{meetingTimeText(mtg)}</td>
      </Typography>
    </React.Fragment>
  );

  // filters and then builds UI elements for the meetings that match this section
  const meetingRows = meetingsForSection(section, meetings).map((mtg, mtgIdx) => (
    renderMeeting(mtg, mtgIdx === 0)
  ));

  // makes a list of the meetings in this section, along with one checkbox for all of them
  const sectionDetails = (
    <ListItem
      onClick={(): void => { dispatch(toggleSelected(courseCardId, secIdx)); }}
      className={styles.noExtraSpace}
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
        {!isLastSection && <Divider className={styles.addBottomSpace} />}
      </ListItemText>
    </ListItem>
  );

  return (
    <React.Fragment key={section.sectionNum}>
      {instructorLabel}
      {sectionDetails}
    </React.Fragment>
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
