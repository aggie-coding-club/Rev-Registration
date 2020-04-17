import * as React from 'react';
import {
  Button, Checkbox, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import GenericCard from '../../GenericCard/GenericCard';
import * as styles from './ConfigureCard.css';
import { replaceSchedules } from '../../../redux/actions/schedules';
import selectSchedule from '../../../redux/actions/selectedSchedule';
import Meeting from '../../../types/Meeting';
// DEBUG
import fetch from './generateSchedulesMock';
import { RootState } from '../../../redux/reducer';
import { CourseCardArray } from '../../../types/CourseCardOptions';
import Availability from '../../../types/Availability';
import { formatTime } from '../../../timeUtil';

/**
 * Allows the user to configure global options for schedule generation. Includes a checkbox to
 * determine whether or not to include full sections and a button to generate schedules.
 */
const ConfigureCard: React.FC = () => {
  const [includeFull, setIncludeFull] = React.useState(false);
  const courseCards = useSelector<RootState, CourseCardArray>((state) => state.courseCards);
  const avsList = useSelector<RootState, Availability[]>((state) => state.availability);
  const dispatch = useDispatch();
  const fetchSchedules = React.useCallback(() => {
    // make courses object
    const courses = [];
    for (let i = 0; i < courseCards.numCardsCreated; i++) {
      if (courseCards[i] && courseCards[i].course) {
        const [subject, courseNum] = courseCards[i].course.split(' ');
        courses.push({
          subject,
          courseNum,
          sections: courseCards[i].sections,
          honors: courseCards[i].honors,
          web: courseCards[i].web,
        });
      }
    }
    // make availabilities object
    const availabilities = avsList.map((avl) => ({
      startTime: formatTime(avl.startTimeHours, avl.startTimeMinutes).replace(':', ''),
      endTime: formatTime(avl.endTimeHours, avl.endTimeMinutes).replace(':', ''),
      day: avl.dayOfWeek,
    }));

    fetch('/api/scheduling/generate', {
      method: 'POST',
      body: JSON.stringify({
        term: '202011',
        includeFull,
        courses,
        availabilities,
      }),
    }).then((res) => res.json()).then(
      (schedules: Meeting[][]) => {
        dispatch(replaceSchedules(schedules));
        dispatch(selectSchedule(0));
      },
    );
  }, [avsList, courseCards, dispatch, includeFull]);

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
        <Button variant="contained" color="primary" onClick={fetchSchedules}>
          Generate Schedules
        </Button>
      </div>
    </GenericCard>
  );
};

export default ConfigureCard;
