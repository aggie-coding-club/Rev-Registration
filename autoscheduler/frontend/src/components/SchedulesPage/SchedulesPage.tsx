import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import SchedulePreview from '../SchedulingPage/SchedulePreview/SchedulePreview';
import Schedule from '../SchedulingPage/Schedule/Schedule';
import * as styles from './SchedulesPage.css';

const SchedulesPage: React.FC<RouteComponentProps> = () => (
  <div className={styles.pageContainer}>
    <SchedulePreview />
    <Schedule />
  </div>
);

export default SchedulesPage;
