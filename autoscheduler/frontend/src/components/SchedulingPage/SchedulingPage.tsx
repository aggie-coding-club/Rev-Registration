import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, navigate } from '@reach/router';
import {
  IconButton, ThemeProvider, useTheme, Typography, Tooltip,
} from '@material-ui/core';
import { Fullscreen, FullscreenExit, SaveAlt } from '@material-ui/icons';
import * as html2canvas from 'html2canvas';
// import html2canvas from 'html2canvas';
import Schedule from './Schedule/Schedule';
import * as styles from './SchedulingPage.css';
import GenerateSchedulesButton from './GenerateSchedulesButton/GenerateSchedulesButton';
import SchedulePreview from './SchedulePreview/SchedulePreview';
import CourseSelectColumn from './CourseSelectColumn/CourseSelectColumn';
import setTerm from '../../redux/actions/term';
import { RootState } from '../../redux/reducer';
import setFullscreen from '../../redux/actions/fullscreen';
import { whiteButtonTheme } from '../../theme';
import saveImage from '../../utils/saveImage';

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
  const scheduleRef = React.useRef<HTMLDivElement>(null);

  function saveToImage(): void {
    const width = 1300;
    const height = 1080;
    const options = {
      width,
      height,
      background: 'red',
      onclone: (document: Document): void => {
        const elem = document.querySelector(`.${styles.scheduleContainer}`) as HTMLElement;
        elem.style.width = `${width}px`;
        elem.style.height = `${height}px`;
        elem.style.maxWidth = `${width}px`; // Remove it's max-width

        const root = document.getElementById('root');
        root.style.width = `${width}px`;
        root.style.height = `${height}px`;
      },
    };

    const notFullscreen = !fullscreen;
    if (notFullscreen) {
      dispatch(setFullscreen(true));
    }

    setTimeout(() => {
      html2canvas(scheduleRef.current, options).then(
        (canvas: HTMLCanvasElement) => {
          if (notFullscreen) {
            // If we weren't in fullscreen before, go back to normal
            dispatch(setFullscreen(false));
          }
          saveImage(canvas.toDataURL(), 'image.png');
        },
      );
    }, 1);
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

  const normal = (
    <div className={styles.pageContainer}>
      <div className={styles.leftContainer} style={fullscreen ? { display: 'none' } : null}>
        <div className={styles.courseCardColumnContainer}>
          <CourseSelectColumn />
        </div>
        <div className={styles.middleColumn}>
          <GenerateSchedulesButton />
          <SchedulePreview hideLoadingIndicator={hideSchedulesLoadingIndicator} />
        </div>
      </div>
      <div
        className={styles.scheduleContainer}
        style={fullscreen ? { maxWidth: 1300 } : null}
      >
        <Schedule scheduleRef={scheduleRef} />
        <div
          className={styles.fullscreenButtonContainer}
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <ThemeProvider theme={whiteButtonTheme}>
            <Typography color="primary" className={styles.totalHoursText}>
              Total Hours: 15
            </Typography>
            <div>
              <Tooltip title="Save Image">
                <IconButton onClick={(): void => saveToImage() }>
                  <SaveAlt color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fullscreen">
                <IconButton onClick={() => dispatch(setFullscreen(!fullscreen)) }>
                  {fullscreen ? <FullscreenExit color="primary" /> : <Fullscreen color="primary" />}
                </IconButton>
              </Tooltip>
            </div>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );

  // return fullscreen ? fullscreenJSX : normal;
  return normal;
};


export default SchedulingPage;
