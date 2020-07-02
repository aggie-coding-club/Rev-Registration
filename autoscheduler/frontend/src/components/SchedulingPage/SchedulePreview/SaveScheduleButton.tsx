import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import { saveSchedule, unsaveSchedule } from '../../../redux/actions/schedules';
import { containsSchedule } from '../../../redux/reducers/schedules';
import { RootState } from '../../../redux/reducer';
import Meeting from '../../../types/Meeting';
import SmallFastProgress from '../../SmallFastProgress';

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
  const color = (saved && !loading) ? 'primary' : 'secondary';
  let icon = saved ? <CloseIcon /> : <SaveIcon />;
  let text = saved ? 'Unsave' : 'Save';

  if (loading) {
    icon = <SmallFastProgress size="small" />;
    text = saved ? 'Saving...' : 'Unsaving...';
  }

  return (
    <Button size="small" variant="contained" color={color} startIcon={icon} onClick={handleClick}>
      {text}
    </Button>
  );
};

export default SaveScheduleButton;
