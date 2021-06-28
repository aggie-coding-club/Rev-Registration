import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ThemeProvider, useTheme, Typography, Tooltip, IconButton,
} from '@material-ui/core';
import { Fullscreen, FullscreenExit, SaveAlt } from '@material-ui/icons';
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
import ScheduleType from '../../types/Schedule';
import hoursForSchedule from '../../utils/hoursForSchedule';
import execute2canvas from '../../utils/html2canvas';
import SmallFastProgress from '../SmallFastProgress';

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
  const currentSchedule = useSelector<RootState, ScheduleType>((state) => (
    state.termData.schedules[state.selectedSchedule]
  ));
  const fullscreen = useSelector<RootState, boolean>((state) => state.fullscreen);
  const scheduleRef = React.useRef<HTMLDivElement>(null);
  const [screenshot, setScreenshot] = React.useState<boolean>(false);
  const [loadingScreenshot, setLoadingScreenshot] = React.useState<boolean>(false);

  function saveToImage(): void {
    const width = 1920;
    const height = 1080;
    const options = {
      width,
      height,
      x: 0,
      onclone: (document: Document): void => {
        // Hide the left container to give the schedule the fullscreen
        const leftContainer = document.querySelector(`.${styles.leftContainer}`) as HTMLElement;
        leftContainer.style.display = 'none';

        const schedContainer = document.querySelector(`.${styles.scheduleContainer}`) as HTMLElement;
        schedContainer.style.width = `${width}px`;
        schedContainer.style.height = `${height}px`;
        schedContainer.style.maxWidth = `${width}px`; // Remove it's max-width

        // Increase the size of the root so the schedule can grow
        const root = document.getElementById('root');
        root.style.width = `${width}px`;
        root.style.height = `${height}px`;

        // Hide the normal card text and show the fullscreen card text
        const normalCards = document.getElementsByClassName('normal-meeting');
        const fullscreenCards = document.getElementsByClassName('fullscreen-meeting');
        for (let i = 0; i < normalCards.length; i++) {
          (normalCards[i] as HTMLElement).style.display = 'none';
          (fullscreenCards[i] as HTMLElement).style.display = 'initial';
        }

        setLoadingScreenshot(false);
      },
    };

    execute2canvas(options, scheduleRef);
  }

  function handleClick(): void {
    setScreenshot(true);
    setLoadingScreenshot(true);
  }

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

  React.useEffect(() => {
    if (screenshot) {
      saveToImage();
      setScreenshot(false);
    }
  }, [screenshot]);

  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.courseCardColumnContainer} ${fullscreen ? styles.hideIfFullscreen : null}`}>
        <CourseSelectColumn />
      </div>
      <div className={`${styles.middleColumn} ${fullscreen ? styles.hideIfFullscreen : null}`}>
        <GenerateSchedulesButton />
        <SchedulePreview hideLoadingIndicator={hideSchedulesLoadingIndicator} />
      </div>
      <div className={styles.scheduleContainer}>
        <Schedule screenshot={screenshot} scheduleRef={scheduleRef} />
        <div
          className={styles.fullscreenButtonContainer}
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <ThemeProvider theme={whiteButtonTheme}>
            <Typography color="primary" className={styles.totalHoursText}>
              {`Total Hours: ${hoursForSchedule(currentSchedule)}`}
            </Typography>
            <div className={styles.rightButtonContainer}>
              {loadingScreenshot ? (
                <div className={styles.loadingIndicatorContainer}>
                  <SmallFastProgress />
                </div>
              ) : (
                <Tooltip title="Save as image">
                  <IconButton onClick={(): void => handleClick()}>
                    <SaveAlt color="primary" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Fullscreen">
                <IconButton
                  onClick={(): void => { dispatch(setFullscreen(!fullscreen)); }}
                  className={styles.overrideIconButton}
                >
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
