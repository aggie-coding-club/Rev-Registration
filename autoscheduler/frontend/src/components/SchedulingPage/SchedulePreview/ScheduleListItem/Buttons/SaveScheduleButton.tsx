import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { saveSchedule, unsaveSchedule } from '../../../../../redux/actions/schedules';
import { containsSchedule } from '../../../../../redux/reducers/schedules';
import { RootState } from '../../../../../redux/reducer';
import Meeting from '../../../../../types/Meeting';

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

  // schedule indices may change when schedules is changed, so refresh state whenever this happens
  // or whenever saved schedules change
  React.useEffect(() => {
    setSaved(containsSchedule(savedSchedules, allSchedules[index]));
  }, [allSchedules, savedSchedules, index]);

  // TODO: Once API for saving schedules is created, call it here
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation();

    if (saved) {
      dispatch(unsaveSchedule(index));
    } else {
      dispatch(saveSchedule(index));
    }
  };

  // change icon and background color based on whether schedule is saved or not
  const icon = saved ? <LockIcon fontSize="inherit" /> : <LockOpenIcon fontSize="inherit" />;
  const tooltipText = saved ? 'Unsave' : 'Save';

  return (
    <Tooltip title={tooltipText} placement="top">
      <IconButton size="small" onClick={handleClick} aria-label="Save schedule">
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default SaveScheduleButton;
