import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListItem, ListItemText, Typography, ListItemSecondaryAction,
} from '@material-ui/core';
import selectSchedule from '../../../../redux/actions/selectedSchedule';
import Meeting from '../../../../types/Meeting';
import Section from '../../../../types/Section';
import * as styles from '../SchedulePreview.css';
import ColorBox from './ColorBox';
import MiniSchedule from './MiniSchedule/MiniSchedule';
import useMeetingColor from '../../Schedule/meetingColors';
import SaveScheduleButton from './Buttons/SaveScheduleButton';
import DeleteScheduleButton from './Buttons/DeleteScheduleButton';
import { RootState } from '../../../../redux/reducer';

interface ScheduleListItemProps {
  index: number;
}

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

const ScheduleListItem: React.FC<ScheduleListItemProps> = ({ index }) => {
  const dispatch = useDispatch();

  const schedule = useSelector<RootState, Meeting[]>((state) => (
    state.schedules.allSchedules[index]
  ));
  const selectedSchedule = useSelector<RootState, number>((state) => state.selectedSchedule);

  // Dynamically create style for buttons to place them after the schedule name,
  // since absolute positioning must be used to place a button inside another button
  const scheduleNameRef = React.useRef(null);

  const meetingColors = useMeetingColor();

  const buttonContainerStyle = {
    top: scheduleNameRef.current?.offsetTop + (scheduleNameRef.current?.offsetHeight / 2) || 0,
    left: scheduleNameRef.current?.offsetLeft + scheduleNameRef.current?.offsetWidth || 0,
  };

  return (
    <ListItem
      button
      alignItems="flex-start"
      key={index}
      onClick={(): void => { dispatch(selectSchedule(index)); }}
      selected={selectedSchedule === index}
      classes={{ root: styles.listItemWithPreview }}
    >
      <ListItemText
        primary={(
          <>
            <div className={styles.scheduleHeader}>
              <span ref={scheduleNameRef}>
                {`Schedule ${index + 1}`}
              </span>
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
      <ListItemSecondaryAction style={buttonContainerStyle}>
        <SaveScheduleButton index={index} />
        <DeleteScheduleButton index={index} />
      </ListItemSecondaryAction>
      <MiniSchedule schedule={schedule} />
    </ListItem>
  );
};

export default ScheduleListItem;
