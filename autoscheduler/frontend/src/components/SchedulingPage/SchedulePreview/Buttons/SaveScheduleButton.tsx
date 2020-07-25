import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { saveSchedule, unsaveSchedule } from '../../../../redux/actions/schedules';
import { containsSchedule } from '../../../../redux/reducers/schedules';
import { RootState } from '../../../../redux/reducer';
import Meeting from '../../../../types/Meeting';
import SmallFastProgress from '../../../SmallFastProgress';
import * as styles from '../SchedulePreview.css';

interface SaveScheduleButtonProps {
  index: number;
}

const SaveScheduleButton: React.FC<SaveScheduleButtonProps> = ({ index }) => {
  const dispatch = useDispatch();
  const allSchedules = useSelector<RootState, Meeting[][]>((state) => state.schedules.allSchedules);
  const savedSchedules = useSelector<RootState, Meeting[][]>((state) => (
    state.schedules.savedSchedules
  ));
  const [saved, setSaved] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // schedule indices may change when schedules is changed, so refresh state whenever this happens
  // or whenever saved schedules change
  React.useEffect(() => {
    setSaved(containsSchedule(savedSchedules, allSchedules[index]));
  }, [allSchedules, savedSchedules, index]);

  // TODO: Once API for saving schedules is created, call it here
  const handleClick = (): void => {
    // do nothing if loading
    if (loading) return;

    setLoading(true);

    if (saved) {
      dispatch(unsaveSchedule(index));
    } else {
      dispatch(saveSchedule(index));
    }

    setLoading(false);
  };

  // change icon and background color based on whether schedule is saved or not
  let icon = saved ? <LockIcon fontSize="inherit" /> : <LockOpenIcon fontSize="inherit" />;
  let tooltipText = saved ? 'Unsave' : 'Save';

  if (loading) {
    icon = <SmallFastProgress size="small" />;
    tooltipText = saved ? 'Saving...' : 'Unsaving...';
  }

  return (
    <Tooltip title={tooltipText} placement="top">
      <IconButton size="small" onClick={handleClick} data-testid="save-schedule">
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default SaveScheduleButton;
