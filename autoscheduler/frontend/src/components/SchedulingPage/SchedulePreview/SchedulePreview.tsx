import * as React from 'react';
import { useSelector } from 'react-redux';
import { List } from '@material-ui/core';
import GenericCard from '../../GenericCard/GenericCard';
import { RootState } from '../../../redux/reducer';
import Meeting from '../../../types/Meeting';
import * as styles from './SchedulePreview.css';
import ScheduleListItem from './ScheduleListItem/ScheduleListItem';

const SchedulePreview: React.FC = () => {
  const schedules = useSelector<RootState, Meeting[][]>((state) => state.schedules.allSchedules);

  const scheduleListItems = schedules.length === 0
    ? <p className={styles.noSchedules}>No schedules available.</p>
    // eslint-disable-next-line react/no-array-index-key
    : schedules.map((schedule, idx) => <ScheduleListItem index={idx} key={idx} />);

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
