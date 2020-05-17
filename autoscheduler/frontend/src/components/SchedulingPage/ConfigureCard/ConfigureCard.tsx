import * as React from 'react';
import {
  Button, Checkbox, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
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
import { CourseCardArray, CustomizationLevel } from '../../../types/CourseCardOptions';
import Availability from '../../../types/Availability';
import { formatTime } from '../../../timeUtil';

/**
 * Allows the user to configure global options for schedule generation. Includes a checkbox to
 * determine whether or not to include full sections and a button to generate schedules.
 */
const ConfigureCard: React.FC = () => {
  const [includeFull, setIncludeFull] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const courseCards = useSelector<RootState, CourseCardArray>((state) => state.courseCards);
  const term = useSelector<RootState, string>((state) => state.term);
  const avsList = useSelector<RootState, Availability[]>((state) => state.availability);
  const dispatch = useDispatch();

  const fetchSchedules = React.useCallback(() => {
    // show loading indicator
    setLoading(true);

    // make courses object
    const courses = [];
    for (let i = 0; i < courseCards.numCardsCreated; i++) {
      if (courseCards[i] && courseCards[i].course) {
        const courseCard = courseCards[i];

        const selectedSections: string[] = []; // the section nums of the selected sections

        // Iterate through the sections and only choose the ones that are selected
        courseCard.sections.forEach((sectionSel) => {
          if (sectionSel.selected) {
            selectedSections.push(sectionSel.section.sectionNum);
          }
        });

        const [subject, courseNum] = courseCard.course.split(' ');
        const isBasic = courseCard.customizationLevel === CustomizationLevel.BASIC;

        // The default option for honors and web when the Section customization level is selected
        const filterDefault = 'no_preference';

        courses.push({
          subject,
          courseNum,
          sections: isBasic ? [] : selectedSections, // Only send if "Section" customization level
          // Only send if "Basic" level
          honors: isBasic ? courseCard.honors ?? filterDefault : filterDefault,
          web: isBasic ? courseCard.web ?? filterDefault : filterDefault,
        });
      }
    }
    // make availabilities object
    const availabilities = avsList.map((avl) => ({
      startTime: formatTime(avl.startTimeHours, avl.startTimeMinutes, true, true).replace(':', ''),
      endTime: formatTime(avl.endTimeHours, avl.endTimeMinutes, true, true).replace(':', ''),
      day: avl.dayOfWeek,
    }));

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
    ).then((data: any[][]) => {
      const ret: Meeting[][] = [];

      data.forEach((schedule) => {
        ret.push(parseAllMeetings(schedule));
      });

      return ret;
    }).then((schedules: Meeting[][]) => {
      dispatch(replaceSchedules(schedules));
      dispatch(selectSchedule(0));
      setLoading(false);
    });
  }, [avsList, courseCards, dispatch, includeFull, term]);

  return (
    <GenericCard
      header={
        <div id={styles.cardHeader}>Configure</div>
      }
    >
      <div className={styles.buttonContainer}>
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
    </GenericCard>
  );
};

export default ConfigureCard;
