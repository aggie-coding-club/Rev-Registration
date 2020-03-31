import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Schedule from './Schedule/Schedule';
import * as styles from './SchedulingPage.css';
import ConfigureCard from './ConfigureCard/ConfigureCard';

const SchedulingPage: React.FC<RouteComponentProps> = (): JSX.Element => (
  <div className={styles.pageContainer}>
    <div className={styles.leftContainer}>
      <div className={styles.leftSubContainer}>Course Select Column</div>
      <div className={styles.middleColumn}>
        <ConfigureCard />
        <div className={styles.leftSubContainer}>Schedule Picker</div>
      </div>
    </div>
    <div className={styles.scheduleContainer}>
      <Schedule />
    </div>
  </div>
);

export default SchedulingPage;
