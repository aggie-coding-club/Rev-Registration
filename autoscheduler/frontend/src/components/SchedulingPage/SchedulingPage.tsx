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

interface SchedulingPageProps extends RouteComponentProps {
  // Option to hide the SchedulePreview loading indicator
  hideSchedulesLoadingIndicator?: boolean;
}

const SchedulingPage: React.FC<SchedulingPageProps> = ({
  hideSchedulesLoadingIndicator = false,
}) => {
  const dispatch = useDispatch();
  const termCurr = useSelector<RootState, string>((state) => state.termData.term);

  // Set redux state on page load based on term from user session
  React.useEffect(() => {
    // If there's a term set, we came from the landing page and don't need to get the last term
    // Also prevents the landing page from clearing course card retrieved from get_saved_courses
    // that would occur from the setTerm action
    if (termCurr) return;

    fetch('sessions/get_last_term').then((res) => res.json()).then(({ term }) => {
      // If unable to get a term, redirect to hompage since term is set by
      // SelectTerm on landing page and session functionality will be unavailable)
      if (term) dispatch(setTerm(term));
      else navigate('/');
    });
  }, [dispatch, termCurr]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.courseCardColumnContainer}>
          <CourseSelectColumn />
        </div>
        <div className={styles.middleColumn}>
          <ConfigureCard />
          <SchedulePreview hideLoadingIndicator={hideSchedulesLoadingIndicator} />
        </div>
      </div>
      <div className={styles.scheduleContainer}>
        <Schedule />
      </div>
    </div>
  );
};


export default SchedulingPage;
