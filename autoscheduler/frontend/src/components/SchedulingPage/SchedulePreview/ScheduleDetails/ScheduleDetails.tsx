import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog, DialogContent, DialogTitle, Divider, IconButton, ThemeProvider, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
import InstructionalMethodIcon from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/InstructionalMethodIcon/InstructionalMethodIcon';
import { whiteButtonTheme } from '../../../../theme';
import hoursForSchedule from '../../../../utils/hoursForSchedule';

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

  function sectionDetails(section: Section, index: number, sections: Section[]): JSX.Element {
    const honorsIcon = section.honors ? (
      <>
        &nbsp;
        <HonorsIcon color="action" />
      </>
    ) : null;

    const sectionHoursText = `${section.minCredits} hour${section.minCredits === 1 ? '' : 's'}`;

    const sectionTitle = (
      <Typography className={styles.sectionTitle} component="div">
        <span className={styles.sectionName}>
          {`${section.subject} ${section.courseNum}-${section.sectionNum}`}
          {honorsIcon}
        </span>
        <span className={styles.instructorName}>
          {section.instructor.name}
        </span>
        <GradeDist grades={section.grades} />
        <span className={styles.rightAlign}>
          <CRNDisplay crn={section.crn} />
        </span>
        <span className={styles.rightAlign}>
          {sectionHoursText}
        </span>
      </Typography>
    );

    const meetingInfo = meetingsForSection(section, meetings).map((meeting) => (
      <Typography className={styles.meetingInfo} variant="body2" color="textSecondary" key={meeting.id}>
        <span className={styles.leftPadding}>
          <MeetingTypeDisplay meeting={meeting} />
        </span>
        <span>{meetingBuildingWithRoom(meeting)}</span>
        <span />
        <span className={styles.rightAlign}>{formatMeetingDays(meeting)}</span>
        <span className={`${styles.rightAlign} ${styles.rightPadding}`}>{meetingTimeText(meeting)}</span>
      </Typography>
    ));

    const isLastSection = index === sections.length - 1;

    let sectionInfoClass = styles.sectionInfo;
    if (!isLastSection) sectionInfoClass += ` ${styles.bottomPadding}`;

    return (
      <React.Fragment key={section.id}>
        <span className={styles.iconContainer}>
          <InstructionalMethodIcon instructionalMethod={section.instructionalMethod} />
        </span>
        <span className={sectionInfoClass}>
          {sectionTitle}
          <Divider className={styles.divider} />
          {meetingInfo}
        </span>
      </React.Fragment>
    );
  }

  const scheduleInfo = (
    <div className={styles.scheduleInfoContainer}>
      {sectionsForSchedule(schedule).map(sectionDetails)}
    </div>
  );

  const hoursDisplay = (
    <Typography className={styles.hoursDisplay} variant="h6">
      {`Total Hours: ${hoursForSchedule(schedule)}`}
    </Typography>
  );

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      onKeyPress={handleKeyPress}
      maxWidth="md"
      PaperProps={{ style: { overflowY: 'initial' } }}
    >
      <DialogTitle>
        <span className={styles.detailsTitle}>
          <span>
            {`${name} - Details`}
          </span>
          <ThemeProvider theme={whiteButtonTheme}>
            <IconButton className={styles.noPadding} color="primary" onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </ThemeProvider>
        </span>
      </DialogTitle>
      <DialogContent>
        {scheduleInfo}
        {hoursDisplay}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDetails;
