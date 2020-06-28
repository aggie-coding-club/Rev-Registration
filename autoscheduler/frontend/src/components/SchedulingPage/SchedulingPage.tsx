import * as React from 'react';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from '@reach/router';
import Schedule from './Schedule/Schedule';
import * as styles from './SchedulingPage.css';
import ConfigureCard from './ConfigureCard/ConfigureCard';
import SchedulePreview from './SchedulePreview/SchedulePreview';
import CourseSelectColumn from './CourseSelectColumn/CourseSelectColumn';
import setTerm from '../../redux/actions/term';

const SchedulingPage: React.FC<RouteComponentProps> = (): JSX.Element => {
  const dispatch = useDispatch();
  // Set redux state on page load based on term from user session
  React.useEffect(() => {
    fetch('sessions/get_last_term').then((res) => res.json()).then((json) => {
      const { term } = json;
      dispatch(setTerm(term));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
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
};

export default SchedulingPage;
