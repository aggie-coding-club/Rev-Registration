import * as React from 'react';
import { IconButton, TextField, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/reducer';
import * as styles from '../../SchedulePreview.css';
import { renameSchedule } from '../../../../../redux/actions/schedules';

interface ScheduleNameProps {
  index: number;
}

const ScheduleName: React.FC<ScheduleNameProps> = ({ index }) => {
  const dispatch = useDispatch();

  const savedName = useSelector<RootState, string>((state) => state.schedules[index].name);

  const [renaming, setRenaming] = React.useState(false);
  const [currentName, setCurrentName] = React.useState(savedName);

  const renameButtonIcon = renaming ? <DoneIcon fontSize="inherit" /> : <EditIcon fontSize="inherit" />;

  const tooltipText = renaming ? 'Done' : 'Rename';

  const handleClick = (): void => {
    if (renaming) {
      // Don't let user set an empty name
      if (currentName.trim()) {
        dispatch(renameSchedule(index, currentName));
        setRenaming(false);
      }
    } else setRenaming(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>): void => {
    // Allow user to confirm name by pressing enter or cancel with escape
    if (renaming) {
      if (e.key === 'Enter') handleClick();
      else if (e.key === 'Escape') {
        setCurrentName(savedName);
        setRenaming(false);
      }
    }
  };

  const nameComponent = renaming ? (
    <TextField
      className={styles.enablePointerEvents}
      defaultValue={savedName}
      fullWidth
      onChange={(e): void => setCurrentName(e.target.value)}
      onKeyDown={handleKeyPress}
      autoFocus
      onFocus={(e): void => e.target.select()}
      inputProps={{ 'aria-label': 'Schedule name', style: { paddingTop: 7 } }}
    />
  ) : (
    // Allow clicking through text if not editing name
    <span className={styles.scheduleNameText}>
      {savedName}
    </span>
  );

  const renameButton = (
    <Tooltip title={tooltipText} placement="top">
      <IconButton
        className={`${styles.enablePointerEvents} ${styles.noFlexShrink}`}
        size="small"
        onClick={handleClick}
        aria-label="Rename schedule"
      >
        {renameButtonIcon}
      </IconButton>
    </Tooltip>
  );

  return (
    <div className={styles.scheduleNameContainer}>
      {nameComponent}
      {renameButton}
    </div>
  );
};

export default ScheduleName;
