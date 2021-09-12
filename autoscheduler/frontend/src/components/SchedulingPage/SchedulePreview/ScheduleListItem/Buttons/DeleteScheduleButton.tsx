import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Tooltip,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Delete';
import { removeSchedule, unsaveSchedule } from '../../../../../redux/actions/schedules';
import { RootState } from '../../../../../redux/reducer';
import Schedule from '../../../../../types/Schedule';

interface DeleteScheduleButtonProps {
  index: number;
}

const DeleteScheduleButton: React.FC<DeleteScheduleButtonProps> = ({ index }) => {
  const dispatch = useDispatch();

  const schedule = useSelector<RootState, Schedule>((state) => (
    state.termData.schedules[index]
  ));

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const deleteSchedule = (): void => {
    dispatch(unsaveSchedule(index));
    dispatch(removeSchedule(index));
  };

  const handleConfirmDelete = (): void => {
    deleteSchedule();
    setDialogOpen(false);
  };

  const handleDeleteButtonClick = (): void => {
    // Show dialog confirmation if schedule is saved, otherwise just delete it
    if (schedule.locked) setDialogOpen(true);
    else deleteSchedule();
  };

  const handleDialogClick = (e: React.MouseEvent<HTMLElement>): void => {
    // Prevent clicking through dialog
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDialogClose = (): void => {
    setDialogOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>): void => {
    // Allow deleting by pressing enter instead of clicking the confirm button
    if (dialogOpen && e.key === 'Enter') handleConfirmDelete();
  };

  return (
    <>
      <Tooltip title="Delete" placement="top">
        <IconButton size="small" onClick={handleDeleteButtonClick} aria-label="Delete schedule">
          <RemoveIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpen}
        onClick={handleDialogClick}
        onClose={handleDialogClose}
        onKeyPress={handleKeyPress}
      >
        <DialogTitle>
          Delete Locked Schedule
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`This schedule is locked. Are you sure you want to delete ${schedule.name}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button startIcon={<RemoveIcon />} color="primary" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteScheduleButton;
