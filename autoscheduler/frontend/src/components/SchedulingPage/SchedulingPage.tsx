import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, navigate } from '@reach/router';
import Schedule from './Schedule/Schedule';
import * as styles from './SchedulingPage.css';
import ConfigureCard from './ConfigureCard/ConfigureCard';
import SchedulePreview from './SchedulePreview/SchedulePreview';
import CourseSelectColumn from './CourseSelectColumn/CourseSelectColumn';
import setTerm from '../../redux/actions/term';
import { RootState } from '../../redux/reducer';

const SchedulingPage: React.FC<RouteComponentProps> = (): JSX.Element => {
  // get term from redux state
  const termForRedir = useSelector<RootState, string>((state) => state.term);
  // when no term is selected, redirect back to the home page
  React.useEffect(() => {
    if (!termForRedir) {
      navigate('/');
    }
  });

  const dispatch = useDispatch();

  // Set redux state on page load based on term from user session
  React.useEffect(() => {
    fetch('sessions/get_last_term').then((res) => res.json()).then(({ term }) => {
      // If unable to get a term, do nothing (term is set by SelectTerm on landing page,
      // but session functionality will be unavailable)
      if (term) dispatch(setTerm(term));
    });
  }, [dispatch]);

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
