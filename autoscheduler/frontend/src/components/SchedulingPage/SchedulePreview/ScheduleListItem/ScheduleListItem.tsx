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
import Schedule from '../../../../types/Schedule';
import ScheduleName from './Buttons/ScheduleName';
import useDimensions from '../../../../hooks/useDimensions';

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

  const schedule = useSelector<RootState, Schedule>((state) => (
    state.schedules[index]
  ));
  const selectedSchedule = useSelector<RootState, number>((state) => state.selectedSchedule);

  const meetingColors = useMeetingColor();

  // Dynamically create style for schedule name and buttons to position them properly
  // since absolute positioning must be used to place a button inside another button
  const scheduleNameRef = React.useRef(null);
  const nameDimensions = useDimensions(scheduleNameRef);

  const buttonContainerStyle: React.CSSProperties = {
    // Disable pointer events so that schedule name can be clicked through, it will be re-enabled
    // on each clickable element
    pointerEvents: 'none',
    // Determine proper positioning and width
    top: nameDimensions.top + (nameDimensions.height / 2),
    left: nameDimensions.left,
    maxWidth: nameDimensions.width,
  };

  return (
    <ListItem
      button
      alignItems="flex-start"
      key={index}
      onClick={(): void => { dispatch(selectSchedule(index)); }}
      selected={selectedSchedule === index}
      classes={{ root: styles.listItemWithPreview }}
      // Having a ListItemSecondaryAction overrides the padding-right to 48px, which we don't want
      // The classes prop is injected before material ui classes, so style is used here instead
      style={{ paddingRight: 16 }}
      aria-label="Schedule preview"
    >
      <ListItemText
        primary={(
          <>
            {/* This element exists to reserve vertical space for the schedule name + buttons,
                and is used  as a ref for where to place those components */}
            <div ref={scheduleNameRef}>
              <span className={styles.hidden}>
                .
              </span>
            </div>
            <Typography className={styles.gpa} variant="subtitle2">
              {getAverageGPATextForSchedule(schedule.meetings)}
            </Typography>
          </>
        )}
        secondary={
          // get unique sections, assuming that meetings from the same section are adjacent
          schedule.meetings.reduce((acc, curr): Section[] => {
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
      <MiniSchedule schedule={schedule.meetings} />
      <ListItemSecondaryAction style={buttonContainerStyle}>
        <div className={styles.scheduleHeader}>
          <ScheduleName index={index} />
          <span className={`${styles.enablePointerEvents} ${styles.noFlexShrink}`}>
            <SaveScheduleButton index={index} />
            <DeleteScheduleButton index={index} />
          </span>
        </div>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ScheduleListItem;
