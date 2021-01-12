import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog, DialogContent, DialogTitle, Divider, IconButton, ThemeProvider, Typography,
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
import InstructionalMethodIcon from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/InstructionalMethodIcon/InstructionalMethodIcon';
import { buttonTheme } from '../../../../theme';

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

  function sectionDetails(section: Section, index: number, sections: Section[]): JSX.Element {
    const honorsIcon = section.honors ? (
      <span className={styles.iconContainer}>
        <HonorsIcon color="action" />
      </span>
    ) : <span />;

    const sectionTitle = (
      <Typography className={styles.sectionTitle} component="div">
        <span>
          {`${section.subject} ${section.courseNum}-${section.sectionNum}`}
        </span>
        <span>
          {section.instructor.name}
        </span>
        <GradeDist grades={section.grades} />
        <span className={styles.rightAlign}>
          <CRNDisplay crn={section.crn} />
        </span>
      </Typography>
    );

    const meetingInfo = meetingsForSection(section, meetings).map((meeting) => (
      <Typography className={styles.meetingInfo} variant="body2" color="textSecondary" key={meeting.id}>
        <span>
          <MeetingTypeDisplay meeting={meeting} />
        </span>
        <span>{formatMeetingDays(meeting)}</span>
        <span>{meetingBuilding(meeting)}</span>
        <span className={styles.rightAlign}>{meetingTimeText(meeting)}</span>
      </Typography>
    ));

    const isLastSection = index === sections.length - 1;

    let sectionInfoClass = styles.sectionInfo;
    if (!isLastSection) sectionInfoClass += ` ${styles.bottomPadding}`;

    return (
      <React.Fragment key={section.id}>
        {honorsIcon}
        <span className={styles.iconContainer}>
          <InstructionalMethodIcon instructionalMethod={section.instructionalMethod} />
        </span>
        <span className={sectionInfoClass}>
          {sectionTitle}
          <Divider />
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

  const previousScheduleButton = (
    <div className={styles.previousButton}>
      <IconButton size="small" color="primary" disabled={idx === 0} onClick={(): void => setIdx(idx - 1)}>
        <ChevronLeft />
      </IconButton>
    </div>
  );

  const nextScheduleButton = (
    <div className={styles.nextButton}>
      <IconButton size="small" color="primary" disabled={idx === schedules.length - 1} onClick={(): void => setIdx(idx + 1)}>
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
        maxWidth="md"
        fullWidth
        PaperProps={{ style: { overflowY: 'initial' } }}
      >
        <DialogTitle>
          {`${name} - Details`}
        </DialogTitle>
        <DialogContent>
          {scheduleInfo}
        </DialogContent>
        <ThemeProvider theme={buttonTheme}>
          {previousScheduleButton}
          {nextScheduleButton}
        </ThemeProvider>
      </Dialog>
    </>
  );
};

export default ScheduleDetails;
