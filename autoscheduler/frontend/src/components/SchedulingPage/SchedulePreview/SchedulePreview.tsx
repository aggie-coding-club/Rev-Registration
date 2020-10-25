import * as React from 'react';
import { useSelector } from 'react-redux';
import { List } from '@material-ui/core';
import GenericCard from '../../GenericCard/GenericCard';
import { RootState } from '../../../redux/reducer';
import * as styles from './SchedulePreview.css';
import ScheduleListItem from './ScheduleListItem/ScheduleListItem';
import Schedule from '../../../types/Schedule';

const SchedulePreview: React.FC = () => {
  const schedules = useSelector<RootState, Schedule[]>((state) => state.schedules);

  const scheduleListItems = schedules.length === 0
    ? <p className={styles.noSchedules}>No schedules available.</p>
    : schedules.map((schedule, idx) => <ScheduleListItem index={idx} key={schedule.name} />);

  return (
    <GenericCard
      className={styles.configureCard}
      header={
        <div id={styles.cardHeader}>Schedules</div>
      }
    >
      <List className={styles.list} disablePadding>
        {scheduleListItems}
      </List>
    </GenericCard>
  );
};

export default SchedulePreview;
