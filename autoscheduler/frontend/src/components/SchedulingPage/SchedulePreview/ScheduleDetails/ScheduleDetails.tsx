import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Divider, Typography,
} from '@material-ui/core';
import { RootState } from '../../../../redux/reducer';
import Schedule from '../../../../types/Schedule';
import * as styles from './ScheduleDetails.css';
import sectionsForSchedule from '../../../../utils/sectionsForSchedule';
import HonorsIcon from '../../../Icons/HonorsIcon/HonorsIcon';
import Section from '../../../../types/Section';
import GradeDist from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/GradeDist/GradeDist';
import meetingsForSection from '../../../../utils/meetingsForSection';
import formatMeetingDays from '../../../../utils/formatMeetingDays';
import { meetingBuildingWithRoom } from '../../../../utils/meetingBuilding';
import MeetingTypeDisplay from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/MeetingType/MeetingTypeDisplay';
import meetingTimeText from '../../../../utils/meetingTimeText';
import CRNDisplay from './CRNDisplay/CRNDisplay';
import SectionAttributeIcons from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionAttributeIcons/SectionAttributeIcons';
import DialogWithClose from '../../../DialogWithClose/DialogWithClose';
import hoursForSchedule from '../../../../utils/hoursForSchedule';
import hoursForSection from '../../../../utils/hoursForSection';

interface ScheduleDetailsProps {
  open: boolean;
  idx: number;
  onClose: () => any;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({
  open: initialOpen, idx: initialIdx, onClose,
}) => {
  const schedules = useSelector<RootState, Schedule[]>((state) => state.termData.schedules);
  const [open, setOpen] = React.useState(initialOpen);
  const [idx, setIdx] = React.useState(initialIdx);

  // If parent updates state, apply those changes
  React.useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  React.useEffect(() => {
    setIdx(initialIdx);
  }, [initialIdx]);

  const schedule = schedules[idx];

  if (!schedule || !open) return null;

  const { meetings, name } = schedule;

  const handleDialogClose = (): void => {
    setOpen(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === 'Escape') handleDialogClose();
  };

  function sectionDetails(section: Section): JSX.Element {
    const honorsIcon = section.honors ? (
      <React.Fragment key={section.id}>
        &nbsp;
        <HonorsIcon color="action" />
      </React.Fragment>
    ) : null;

    const sectionInfo = (
      <Typography className={styles.sectionInfo} component="div">
        <span className={styles.sectionInfoItem}>
          {`${section.subject} ${section.courseNum}-${section.sectionNum}`}
          {honorsIcon}
        </span>
        <span className={styles.instructorName}>
          {section.instructor.name}
        </span>
        <span className={styles.sectionInfoItem}>
          <GradeDist grades={section.grades} />
        </span>
        <span className={styles.sectionInfoItem}>
          <CRNDisplay crn={section.crn} />
        </span>
        <span className={styles.rightAlign}>
          {hoursForSection(section)}
        </span>
      </Typography>
    );

    const rightAlignAndMargin = `${styles.rightAlign} ${styles.rightMargin}`;

    const meetingInfo = meetingsForSection(section, meetings).map((meeting) => (
      <Typography className={styles.meetingInfo} variant="body2" color="textSecondary" key={meeting.id}>
        <span />
        <span className={styles.leftMargin}>
          <MeetingTypeDisplay meeting={meeting} />
        </span>
        <span>{meetingBuildingWithRoom(meeting)}</span>
        <span />
        <span className={rightAlignAndMargin}>{formatMeetingDays(meeting)}</span>
        <span className={rightAlignAndMargin}>{meetingTimeText(meeting)}</span>
      </Typography>
    ));

    return (
      <React.Fragment key={section.id}>
        <span className={styles.iconContainer}>
          <SectionAttributeIcons section={section} />
        </span>
        {sectionInfo}
        <Divider className={styles.divider} />
        {meetingInfo}
      </React.Fragment>
    );
  }

  const scheduleInfo = (
    <Typography className={styles.scheduleInfo} component="div">
      {sectionsForSchedule(schedule).map(sectionDetails)}
    </Typography>
  );

  const hoursDisplay = (
    <Typography className={styles.hoursDisplay} variant="h6">
      {`Total Hours: ${hoursForSchedule(schedule)}`}
    </Typography>
  );

  const dialogTitle = `${name} - Details`;

  return (
    <DialogWithClose
      title={dialogTitle}
      open={open}
      onClose={handleDialogClose}
      onKeyPress={handleKeyPress}
      PaperProps={{ style: { overflowY: 'initial' } }}
    >
      {scheduleInfo}
      {hoursDisplay}
    </DialogWithClose>
  );
};

export default ScheduleDetails;
