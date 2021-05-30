import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ThemeProvider, useTheme, Typography, Tooltip, IconButton,
} from '@material-ui/core';
import { Fullscreen, FullscreenExit } from '@material-ui/icons';
import { RouteComponentProps, navigate } from '@reach/router';
import Schedule from './Schedule/Schedule';
import * as styles from './SchedulingPage.css';
import GenerateSchedulesButton from './GenerateSchedulesButton/GenerateSchedulesButton';
import SchedulePreview from './SchedulePreview/SchedulePreview';
import CourseSelectColumn from './CourseSelectColumn/CourseSelectColumn';
import setTerm from '../../redux/actions/term';
import { RootState } from '../../redux/reducer';
import { whiteButtonTheme } from '../../theme';
import setFullscreen from '../../redux/actions/fullscreen';

interface SchedulingPageProps extends RouteComponentProps {
  // Option to hide the SchedulePreview loading indicator
  hideSchedulesLoadingIndicator?: boolean;
}

const SchedulingPage: React.FC<SchedulingPageProps> = ({
  hideSchedulesLoadingIndicator = false,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const termCurr = useSelector<RootState, string>((state) => state.termData.term);
  const fullscreen = useSelector<RootState, boolean>((state) => state.fullscreen);

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
      {/* Hide the left & middle column if we're fullscreen */}
      <div className={styles.leftContainer} style={fullscreen ? { display: 'none' } : null}>
        <div className={styles.courseCardColumnContainer}>
          <CourseSelectColumn />
        </div>
        <div className={styles.middleColumn}>
          <GenerateSchedulesButton />
          <SchedulePreview hideLoadingIndicator={hideSchedulesLoadingIndicator} />
        </div>
      </div>
      <div className={styles.scheduleContainer}>
        <Schedule />
        <div
          className={styles.fullscreenButtonContainer}
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <ThemeProvider theme={whiteButtonTheme}>
            <Typography color="primary" className={styles.totalHoursText}>
              Total Hours: 15
            </Typography>
            <div>
              <Tooltip title="Fullscreen">
                <IconButton onClick={() => dispatch(setFullscreen(!fullscreen))}>
                  {fullscreen ? <FullscreenExit color="primary" /> : <Fullscreen color="primary" />}
                </IconButton>
              </Tooltip>
            </div>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};


export default SchedulingPage;
