import * as React from 'react';
import * as Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { List } from '@material-ui/core';
import GenericCard from '../../GenericCard/GenericCard';
import { RootState } from '../../../redux/reducer';
import * as styles from './SchedulePreview.css';
import ScheduleListItem from './ScheduleListItem/ScheduleListItem';
import Schedule from '../../../types/Schedule';
import { setSchedules } from '../../../redux/actions/schedules';
import createThrottleFunction from '../../../utils/createThrottleFunction';
import { parseAllMeetings } from '../../../redux/actions/courseCards';

const throttle = createThrottleFunction();

export const noSchedulesText = "Click Generate Schedules to find schedules with the courses you've added.";

interface SchedulePreviewProps {
  // Is a prop so we can set the throttle time to a really low number when testing
  throttleTime?: number;
}

const SchedulePreview: React.FC<SchedulePreviewProps> = ({ throttleTime = 5000 }) => {
  const dispatch = useDispatch();
  const schedules = useSelector<RootState, Schedule[]>((state) => state.schedules);
  const term = useSelector<RootState, string>((state) => state.term);

  const scheduleListItems = schedules.length === 0
    ? <p className={styles.noSchedules}>{noSchedulesText}</p>
    : schedules.map((schedule, idx) => <ScheduleListItem index={idx} key={schedule.name} />);

  // Whenever the term changes, fetch and load saved schedules
  React.useEffect(() => {
    if (term) {
      fetch(`sessions/get_saved_schedules?term=${term}`).then(
        (res) => res.json(),
      ).then((arr: any[]): Schedule[] => arr.map((val) => ({
        // TODO: Should we rename the schedule names if they're in the form of "Schedule #"?
        name: val.name,
        meetings: parseAllMeetings(val.sections),
        saved: true,
      }))).then((savedSchedules: Schedule[]) => {
        dispatch(setSchedules(savedSchedules));
      });
    }

    // on unmount, clear schedules
    return (): void => {
      dispatch(setSchedules([]));
    };
  }, [term, dispatch]);

  // Call throttle to serialize and save the schedules anytime we make a change to the schedules
  React.useEffect(() => {
    if (!term) return;

    // Serialize schedules and make API call
    const saveSchedules = (): void => {
      let serializedSchedules: { name: string; sections: number[] }[] = [];

      if (schedules) {
        if (schedules.length === 0) {
          return;
        }

        serializedSchedules = schedules.filter(
          // Filter out unsaved schedules
          (schedule) => schedule.saved,
        ).map((schedule) => ({
          name: schedule.name,
          // Get a list of the section IDs that are in this schedule
          sections: [...new Set(schedule.meetings.map((m) => m.section.id))],
        }));
      }

      fetch('sessions/save_schedules', {
        method: 'PUT',
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify({ term, schedules: serializedSchedules }),
      });
    };

    throttle(term, saveSchedules, throttleTime, true);
  }, [schedules, term, throttleTime]);

  return (
    <GenericCard
      className={styles.configureCard}
      header={
        <div id={styles.cardHeader}>Schedules</div>
      }
    >
      <List className={styles.list} disablePadding>
        {scheduleListItems}
      </List>
    </GenericCard>
  );
};

export default SchedulePreview;
