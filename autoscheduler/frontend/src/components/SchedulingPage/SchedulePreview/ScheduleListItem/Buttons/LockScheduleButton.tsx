import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { saveSchedule, unsaveSchedule } from '../../../../../redux/actions/schedules';
import { RootState } from '../../../../../redux/reducer';

interface LockScheduleButtonProps {
  index: number;
}

const LockScheduleButton: React.FC<LockScheduleButtonProps> = ({ index }) => {
  const dispatch = useDispatch();

  const locked = useSelector<RootState, boolean>((state) => state.termData.schedules[index].locked);

  // TODO: Once API for saving schedules is created, call it here
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation();

    if (locked) {
      dispatch(unsaveSchedule(index));
    } else {
      dispatch(saveSchedule(index));
    }
  };

  // change icon and background color based on whether schedule is saved or not
  const icon = locked ? <LockIcon fontSize="inherit" /> : <LockOpenIcon fontSize="inherit" />;
  const tooltipText = locked ? 'Unlock' : 'Lock';

  return (
    <Tooltip title={tooltipText} placement="top">
      <IconButton size="small" onClick={handleClick} aria-label="Lock schedule">
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default LockScheduleButton;
