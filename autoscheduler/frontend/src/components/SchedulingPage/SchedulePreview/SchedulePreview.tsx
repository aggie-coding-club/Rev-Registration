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
import SmallFastProgress from '../../SmallFastProgress';
import { SaveSchedulesRequest, SerializedSchedule } from '../../../types/APIRequests';
import ScheduleDetails from './ScheduleDetails/ScheduleDetails';
import selectSchedule from '../../../redux/actions/selectedSchedule';

const throttle = createThrottleFunction();

export const noSchedulesText = "Click Generate Schedules to find schedules with the courses you've added.";

interface SchedulePreviewProps {
  // Is a prop so we can set the throttle time to a really low number when testing
  throttleTime?: number;
  // Option to to hide the loading indicator, exclusively used for tests
  hideLoadingIndicator?: boolean;
}

const SchedulePreview: React.FC<SchedulePreviewProps> = ({
  throttleTime = 10000, hideLoadingIndicator = false,
}) => {
  const dispatch = useDispatch();
  const schedules = useSelector<RootState, Schedule[]>((state) => state.termData.schedules);
  const selectedSchedule = useSelector<RootState, number>((state) => state.selectedSchedule);
  const term = useSelector<RootState, string>((state) => state.termData.term);
  const [isLoadingSchedules, setIsLoadingSchedules] = React.useState(!hideLoadingIndicator);

  const [scheduleDetailsIndex, setScheduleDetailsIndex] = React.useState<number>();
  const [scheduleDetailsOpen, setScheduleDetailsOpen] = React.useState(false);

  const handleDetailsClose = (): void => {
    setScheduleDetailsOpen(false);
  };

  const scheduleListItems = schedules.length === 0
    ? <p className={styles.noSchedules}>{noSchedulesText}</p>
    : schedules.map((schedule, idx) => {
      const handleDetailsClick = (): void => {
        setScheduleDetailsIndex(idx);
        setScheduleDetailsOpen(true);
      };

      return (
        <ScheduleListItem
          index={idx}
          onDetailsClick={handleDetailsClick}
          key={schedule.name}
        />
      );
    });

  // Whenever the term changes, fetch and load saved schedules
  React.useEffect(() => {
    if (term) {
      fetch(`sessions/get_saved_schedules?term=${term}`).then(
        (res) => res.json(),
      ).then((obj: any): void => {
        const serialized = obj.schedules.map((val: SerializedSchedule) => ({
          name: val.name,
          meetings: parseAllMeetings(val.sections),
          locked: val.locked,
        }));

        console.log(obj.selectedSchedule);
        dispatch(setSchedules(serialized, term));
        if (obj.selectedSchedule !== undefined) {
          dispatch(selectSchedule(obj.selectedSchedule));
        }
        setIsLoadingSchedules(false);
      }).catch(() => {
        // Hide loading indicator if there's an error
        // Otherwise, loading indicator would display indefinitely
        setIsLoadingSchedules(false);
      });
    }

    // on unmount, clear schedules
    return (): void => {
      // Re-show the loading indicator when we change terms
      setIsLoadingSchedules(true);
    };
  }, [term, dispatch]);

  // Call throttle to serialize and save the schedules anytime we make a change to the schedules
  React.useEffect(() => {
    // Don't attempt to save schedules if they're still loading (or if the term is falsy)
    if (!term || isLoadingSchedules) return;

    // Serialize schedules and make API call
    const saveSchedules = (): void => {
      const serializedSchedules: SerializedSchedule[] = schedules.map((schedule) => ({
        name: schedule.name,
        // Get a list of the section IDs that are in this schedule
        sections: [...new Set(schedule.meetings.map((m) => m.section.id))],
        locked: schedule.locked,
      }));

      const request: SaveSchedulesRequest = {
        term,
        selectedSchedule,
        schedules: serializedSchedules,
      };

      fetch('sessions/save_schedules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(request),
      });
    };

    throttle(term, saveSchedules, throttleTime, true);
  }, [schedules, term, throttleTime, isLoadingSchedules, selectedSchedule]);

  // On unmount, force-call the previously called throttle functions
  // This way when we navigate back to the homepage we can guarantee saveSchedules
  // will have been called
  React.useEffect(() => (): void => {
    throttle('', () => {}, 2 ** 31 - 1, true);
  }, []);

  return (
    <GenericCard
      className={styles.configureCard}
      header={
        <div id={styles.cardHeader}>Schedules</div>
      }
    >
      {isLoadingSchedules ? (
        <div className={styles.schedulesLoadingIndicator} aria-label="schedules-loading-indicator">
          <SmallFastProgress size="large" />
        </div>
      ) : (
        <>
          <List className={styles.list} disablePadding>
            {scheduleListItems}
          </List>
          <ScheduleDetails
            open={scheduleDetailsOpen}
            idx={scheduleDetailsIndex}
            onClose={handleDetailsClose}
          />
        </>
      )}
    </GenericCard>
  );
};

export default SchedulePreview;
