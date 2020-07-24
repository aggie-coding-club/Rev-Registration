import * as React from 'react';
import {
  Button, Checkbox, ListItem, ListItemIcon, ListItemText, Snackbar, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useDispatch, useSelector } from 'react-redux';
import GenericCard from '../../GenericCard/GenericCard';
import SmallFastProgress from '../../SmallFastProgress';
import * as styles from './ConfigureCard.css';
import { replaceSchedules } from '../../../redux/actions/schedules';
import selectSchedule from '../../../redux/actions/selectedSchedule';
import Meeting from '../../../types/Meeting';
import { parseAllMeetings } from '../../../redux/actions/courseCards';
// DEBUG
import { RootState } from '../../../redux/reducer';
import { CourseCardArray, CustomizationLevel, SerializedCourseCardOptions } from '../../../types/CourseCardOptions';
import Availability from '../../../types/Availability';
import { formatTime } from '../../../timeUtil';

/**
 * Allows the user to configure global options for schedule generation. Includes a checkbox to
 * determine whether or not to include full sections and a button to generate schedules.
 */
const ConfigureCard: React.FC = () => {
  const [includeFull, setIncludeFull] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  // Holds a reference to the DOM element to check if the component is still mounted
  const ref = React.useRef();
  const courseCards = useSelector<RootState, CourseCardArray>((state) => state.courseCards);
  const term = useSelector<RootState, string>((state) => state.term);
  const avsList = useSelector<RootState, Availability[]>((state) => state.availability);
  const dispatch = useDispatch();

  const checkIfEmpty = (schedules: Meeting[][]): Meeting[][] => {
    if (ref.current && schedules.length === 0) setShowSnackbar(true);
    return schedules;
  };

  // closes the snackbar if the user presses the close icon, but not if they click away
  const handleSnackbarClose = (_event: any, reason: string): void => {
    if (reason === 'clickaway') return;
    setShowSnackbar(false);
  };

  const fetchSchedules = React.useCallback(() => {
    // show loading indicator
    setLoading(true);

    // make courses object
    const courses = [];
    for (let i = 0; i < courseCards.numCardsCreated; i++) {
      if (courseCards[i] && courseCards[i].course) {
        const courseCard = courseCards[i];

        // Iterate through the sections and only choose the ones that are selected
        const selectedSections = courseCard.sections
          .filter((sectionSel) => sectionSel.selected)
          .map((sectionSel) => sectionSel.section.sectionNum);

        const [subject, courseNum] = courseCard.course.split(' ');
        const isBasic = courseCard.customizationLevel === CustomizationLevel.BASIC;

        // The default option for honors and web when the Section customization level is selected
        const filterDefault = 'no_preference';

        courses.push({
          subject,
          courseNum,
          sections: isBasic ? [] : selectedSections, // Only send if "Section" customization level
          // Only send if "Basic" level
          honors: isBasic ? (courseCard.honors ?? filterDefault) : filterDefault,
          web: isBasic ? (courseCard.web ?? filterDefault) : filterDefault,
        });
      }
    }
    // make availabilities object
    const availabilities = avsList.map((avl) => ({
      startTime: formatTime(avl.startTimeHours, avl.startTimeMinutes, true, true).replace(':', ''),
      endTime: formatTime(avl.endTimeHours, avl.endTimeMinutes, true, true).replace(':', ''),
      day: avl.dayOfWeek,
    }));

    // make request to generate schedules and update redux, will also save availabilities
    fetch('scheduler/generate', {
      method: 'POST',
      body: JSON.stringify({
        term,
        includeFull,
        courses,
        availabilities,
      }),
    }).then(
      (res) => res.json(),
    ).then(
      (generatedSchedules: any[][]) => generatedSchedules.map(parseAllMeetings),
    )
      .then(
        checkIfEmpty,
      )
      .then((schedules: Meeting[][]) => {
        dispatch(replaceSchedules(schedules));
        dispatch(selectSchedule(0));
        if (ref.current) setLoading(false);
      });

    // make request to save course cards
    const courseData: SerializedCourseCardOptions[] = [];
    for (let i = 0; i < courseCards.numCardsCreated; i++) {
      const course = courseCards[i];
      if (course) {
        const sections = course.sections.filter(({ selected }) => selected).map((sectionSel) => (
          sectionSel.section.id
        ));
        courseData.push({
          course: course.course,
          customizationLevel: course.customizationLevel,
          honors: course.honors,
          web: course.web,
          sections,
        });
      }
    }

    fetch('sessions/save_courses', {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }, [avsList, courseCards, dispatch, includeFull, term]);

  return (
    <GenericCard
      header={
        <div id={styles.cardHeader}>Configure</div>
      }
    >
      <div className={styles.buttonContainer} ref={ref}>
        <div id={styles.instructions}>
          Click and drag in the calendar on the right to block off times when you
          are unavailable, then press Generate Schedules below.
        </div>
        <ListItem
          disableGutters
          onClick={(): void => setIncludeFull(!includeFull)}
          style={{ cursor: 'pointer' }}
        >
          <ListItemIcon>
            <Checkbox color="primary" checked={includeFull} />
          </ListItemIcon>
          <ListItemText>
            Include full sections
          </ListItemText>
        </ListItem>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchSchedules}
          disabled={loading}
        >
          {loading
            ? <SmallFastProgress />
            : 'Generate Schedules'}
        </Button>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        message="No schedules found. Try widening your criteria."
        onClose={handleSnackbarClose}
        action={(
          <IconButton aria-label="close" onClick={(): void => setShowSnackbar(false)}>
            <CloseIcon fontSize="small" style={{ color: 'white' }} />
          </IconButton>
        )}
      />
    </GenericCard>
  );
};

export default ConfigureCard;
