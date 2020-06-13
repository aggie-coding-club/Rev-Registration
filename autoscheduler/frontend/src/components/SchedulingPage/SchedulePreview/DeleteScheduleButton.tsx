import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Delete';
import { removeSchedule, unsaveSchedule } from '../../../redux/actions/schedules';

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
    <Button size="small" variant="contained" color="primary" startIcon={<RemoveIcon />} onClick={handleClick}>
      Delete
    </Button>
  );
};

export default DeleteScheduleButton;
