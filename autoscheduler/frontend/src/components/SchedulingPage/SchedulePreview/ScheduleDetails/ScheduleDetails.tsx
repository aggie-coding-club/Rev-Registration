import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog, DialogContent, DialogTitle, Divider, IconButton, SvgIcon, Typography,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import { RootState } from '../../../../redux/reducer';
import Schedule from '../../../../types/Schedule';
import * as styles from './ScheduleDetails.css';
import sectionsForSchedule from '../../../../utils/sectionsForSchedule';
import HonorsIcon from '../../../Icons/HonorsIcon/HonorsIcon';
import Section from '../../../../types/Section';
import GradeDist from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/GradeDist/GradeDist';
import meetingsForSection from '../../../../utils/meetingsForSection';
import formatMeetingDays from '../../../../utils/formatMeetingDays';
import meetingBuilding from '../../../../utils/meetingBuilding';
import MeetingTypeDisplay from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/MeetingType/MeetingTypeDisplay';
import meetingTimeText from '../../../../utils/meetingTimeText';
import CRNDisplay from './CRNDisplay/CRNDisplay';

interface ScheduleDetailsProps {
  open: boolean;
  idx: number;
  onClose: () => any;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({
  open: initialOpen, idx: initialIdx, onClose,
}) => {
  const schedules = useSelector<RootState, Schedule[]>((state) => state.schedules);
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
    // TODO: add CRN button
    const sectionTitle = (
      <Typography className={styles.sectionTitle} component="div">
        {section.honors ? <HonorsIcon /> : <SvgIcon />}
        <span>
          {`${section.subject} ${section.courseNum}-${section.sectionNum}`}
        </span>
        <span>
          {section.instructor.name}
        </span>
        <GradeDist grades={section.grades} />
        <CRNDisplay crn={section.crn} />
      </Typography>
    );

    const meetingInfo = meetingsForSection(section, meetings).map((meeting) => (
      <Typography className={styles.meetingInfo} variant="body2" key={meeting.id}>
        <span>
          <MeetingTypeDisplay meeting={meeting} />
        </span>
        <span>{formatMeetingDays(meeting)}</span>
        <span>{meetingBuilding(meeting)}</span>
        <span>{meetingTimeText(meeting)}</span>
      </Typography>
    ));

    return (
      <div key={section.id}>
        {sectionTitle}
        <Divider />
        {meetingInfo}
      </div>
    );
  }

  const scheduleInfo = (
    <div className={styles.scheduleInfoContainer}>
      {sectionsForSchedule(schedule).map(sectionDetails)}
    </div>
  );

  const previousScheduleButton = (
    <div className={styles.previousButton}>
      <IconButton disabled={idx === 0} onClick={(): void => setIdx(idx - 1)}>
        <ChevronLeft />
      </IconButton>
    </div>
  );

  const nextScheduleButton = (
    <div className={styles.nextButton}>
      <IconButton disabled={idx === schedules.length - 1} onClick={(): void => setIdx(idx + 1)}>
        <ChevronRight />
      </IconButton>
    </div>
  );

  return (
    <>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        onKeyPress={handleKeyPress}
        fullWidth
        PaperProps={{ style: { overflowY: 'initial' } }}
      >
        <DialogTitle>
          {`${name} - Details`}
        </DialogTitle>
        <DialogContent>
          {scheduleInfo}
        </DialogContent>
        {previousScheduleButton}
        {nextScheduleButton}
      </Dialog>
    </>
  );
};

export default ScheduleDetails;
