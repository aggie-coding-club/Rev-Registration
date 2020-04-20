import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ListItem, List, ListItemText,
} from '@material-ui/core';
import GenericCard from '../../GenericCard/GenericCard';
import { RootState } from '../../../redux/reducer';
import selectSchedule from '../../../redux/actions/selectedSchedule';
import Meeting from '../../../types/Meeting';
import Section from '../../../types/Section';
import * as styles from './SchedulePreview.css';
import Grades from '../../../types/Grades';

const SchedulePreview: React.FC = () => {
  const schedules = useSelector<RootState, Meeting[][]>((state) => state.schedules);
  const selectedSchedule = useSelector<RootState, number>((state) => state.selectedSchedule);
  const dispatch = useDispatch();

  const dummyGrades = new Grades({
    A: 10, B: 10, C: 0, D: 0, F: 1, I: 0, S: 0, Q: 0, X: 0, gpa: 3.5,
  });

  const renderSchedule = (schedule: Meeting[], idx: number): JSX.Element => (
    <ListItem
      button
      alignItems="flex-start"
      key={idx}
      onClick={(): void => { dispatch(selectSchedule(idx)); }}
      selected={selectedSchedule === idx}
    >
      <ListItemText
        primary={(
          <span>
            <span>{`Schedule ${idx + 1}`}</span>
            <span className={styles.gpa}>
              {`${dummyGrades.gpa.toString().slice(0, 4)} `}
              GPA
            </span>
          </span>
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
            <span key={sec.id}>
              {`${sec.subject} ${sec.courseNum}-${sec.sectionNum}`}
              <br />
            </span>
          ))
        }
      />
    </ListItem>
  );

  return (
    <GenericCard
      className={styles.configureCard}
      header={
        <div id={styles.cardHeader}>Schedules</div>
      }
    >
      <List className={styles.list}>
        {schedules.length === 0
          ? <p className={styles.noSchedules}>No schedules available.</p>
          : schedules.map((schedule, idx) => renderSchedule(schedule, idx))}
      </List>
    </GenericCard>
  );
};

export default SchedulePreview;
