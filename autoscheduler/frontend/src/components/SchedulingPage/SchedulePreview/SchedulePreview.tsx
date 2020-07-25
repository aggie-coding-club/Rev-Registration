import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListItem, List, ListItemText, Typography,
} from '@material-ui/core';
import GenericCard from '../../GenericCard/GenericCard';
import { RootState } from '../../../redux/reducer';
import selectSchedule from '../../../redux/actions/selectedSchedule';
import Meeting from '../../../types/Meeting';
import Section from '../../../types/Section';
import * as styles from './SchedulePreview.css';
import MiniSchedule from './MiniSchedule/MiniSchedule';
import ColorBox from './ColorBox';
import useMeetingColor from '../Schedule/meetingColors';
import SaveScheduleButton from './Buttons/SaveScheduleButton';
import DeleteScheduleButton from './Buttons/DeleteScheduleButton';

// Exported so we can test it
export function getAverageGPATextForSchedule(schedule: Meeting[]): string {
  let gpaSum = 0;
  let gpaCount = 0;

  schedule.forEach((meeting) => {
    if (meeting.section.grades != null) {
      const creditHours = meeting.section.minCredits;

      // This should be weighed by the credit hours
      gpaSum += meeting.section.grades.gpa * creditHours;
      gpaCount += creditHours;
    }
  });

  // Sections contained no grades
  if (gpaCount === 0) {
    return 'GPA: N/A';
  }

  const result = gpaSum / gpaCount;

  return `GPA: ${result.toFixed(2)}`;
}

const SchedulePreview: React.FC = () => {
  const schedules = useSelector<RootState, Meeting[][]>((state) => state.schedules.allSchedules);
  const selectedSchedule = useSelector<RootState, number>((state) => state.selectedSchedule);
  const dispatch = useDispatch();
  const meetingColors = useMeetingColor();

  const renderSchedule = (schedule: Meeting[], idx: number): JSX.Element => (
    <ListItem
      button
      alignItems="flex-start"
      key={idx}
      onClick={(): void => { dispatch(selectSchedule(idx)); }}
      selected={selectedSchedule === idx}
      classes={{ root: styles.listItemWithPreview }}
    >
      <ListItemText
        primary={(
          <>
            <div className={styles.scheduleHeader}>
              <span>
                {`Schedule ${idx + 1}`}
              </span>
              <SaveScheduleButton index={idx} />
              <DeleteScheduleButton index={idx} />
            </div>
            <Typography className={styles.gpa} variant="subtitle2">
              {getAverageGPATextForSchedule(schedule)}
            </Typography>
          </>
        )}
        secondary={
          // get unique sections, assuming that meetings from the same section are adjacent
          schedule.reduce((acc, curr): Section[] => {
            const lastSection = acc[acc.length - 1];
            if (!lastSection || lastSection.id !== curr.section.id) {
              return acc.concat(curr.section);
            }
            return acc;
          }, []).map((sec: Section) => (
            <span key={sec.id} className={styles.sectionLabelRow}>
              <ColorBox color={meetingColors.get(sec.subject + sec.courseNum)} />
              {`${sec.subject} ${sec.courseNum}-${sec.sectionNum}`}
              <br />
            </span>
          ))
        }
      />
      <MiniSchedule schedule={schedule} />
    </ListItem>
  );

  return (
    <GenericCard
      className={styles.configureCard}
      header={
        <div id={styles.cardHeader}>Schedules</div>
      }
    >
      <List className={styles.list} disablePadding>
        {schedules.length === 0
          ? <p className={styles.noSchedules}>No schedules available.</p>
          : schedules.map((schedule, idx) => renderSchedule(schedule, idx))}
      </List>
    </GenericCard>
  );
};

export default SchedulePreview;
