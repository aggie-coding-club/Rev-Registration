import * as React from 'react';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Delete';
import { removeSchedule, unsaveSchedule } from '../../../../redux/actions/schedules';
import * as styles from '../SchedulePreview.css';

interface DeleteScheduleButtonProps {
  index: number;
}

const DeleteScheduleButton: React.FC<DeleteScheduleButtonProps> = ({ index }) => {
  const dispatch = useDispatch();

  const handleClick = (): void => {
    dispatch(unsaveSchedule(index));
    dispatch(removeSchedule(index));
  };

  return (
    <Tooltip title="Delete" placement="top">
      <IconButton size="small" onClick={handleClick} data-testid="delete-schedule">
        <RemoveIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
};

export default DeleteScheduleButton;
