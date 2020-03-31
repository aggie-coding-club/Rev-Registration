import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Schedule from '../Schedule/Schedule';
import * as styles from './SchedulingPage.css';

const SchedulingPage: React.FC<RouteComponentProps> = (): JSX.Element => (
  <div className={styles.pageContainer}>
    <div className={styles.placeholder}>Course Select Column</div>
    <div className={styles.middleColumn}>
      <div className={styles.placeholder}>Options Card</div>
      <div className={styles.placeholder}>Schedule Picker</div>
    </div>
    <div className={styles.scheduleContainer}>
      <Schedule />
    </div>
  </div>
);

export default SchedulingPage;
