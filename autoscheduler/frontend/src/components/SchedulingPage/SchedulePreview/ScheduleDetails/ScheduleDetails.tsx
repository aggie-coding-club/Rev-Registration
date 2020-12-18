import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog, DialogContent, DialogTitle, Divider, SvgIcon, Typography,
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
import meetingBuilding from '../../../../utils/meetingBuilding';
import MeetingTypeDisplay from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/MeetingType/MeetingTypeDisplay';
import meetingTimeText from '../../../../utils/meetingTimeText';

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

  if (!schedule) return null;

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

  return (
    <Dialog open={open} onClose={handleDialogClose} onKeyPress={handleKeyPress} fullWidth>
      <DialogTitle>
        {`${name} - Details`}
      </DialogTitle>
      <DialogContent>
        {scheduleInfo}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDetails;
