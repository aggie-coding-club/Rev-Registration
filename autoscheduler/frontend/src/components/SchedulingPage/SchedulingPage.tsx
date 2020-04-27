import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import Schedule from './Schedule/Schedule';
import * as styles from './SchedulingPage.css';
import ConfigureCard from './ConfigureCard/ConfigureCard';
import SchedulePreview from './SchedulePreview/SchedulePreview';
import CourseSelectColumn from './CourseSelectColumn/CourseSelectColumn';

const SchedulingPage: React.FC<RouteComponentProps> = (): JSX.Element => (
  <div className={styles.pageContainer}>
    <div className={styles.leftContainer}>
      <div className={styles.courseCardColumnContainer}>
        <CourseSelectColumn />
      </div>
      <div className={styles.middleColumn}>
        <ConfigureCard />
        <SchedulePreview />
      </div>
    </div>
    <div className={styles.scheduleContainer}>
      <Schedule />
    </div>
  </div>
);

export default SchedulingPage;
