import * as React from 'react';
import {
  Button,
} from '@material-ui/core';
import SmallFastProgress from '../../SmallFastProgress';
import * as styles from './GenerateSchedulesButton.css';
import { generateSchedules } from '../../../redux/actions/schedules';
import useThunkDispatch from '../../../hooks/useThunkDispatch';
import GenericSnackbar from '../../GenericSnackbar';

const GenerateSchedulesButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const dispatch = useThunkDispatch();

  // Holds a reference to the DOM element to check if the component is still mounted
  const isMounted = React.useRef(true);
  React.useEffect((): VoidFunction => (): void => {
    isMounted.current = false;
  }, []);

  // closes the snackbar if the user presses the close icon, but not if they click away
  const fetchSchedules = (): void => {
    // show loading indicator
    setLoading(true);

    dispatch(generateSchedules())
      .catch((e: Error) => setSnackbarMessage(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.buttonContainer}>
      <Button
        variant="contained"
        color="secondary"
        onClick={fetchSchedules}
        disabled={loading}
      >
        {loading
          ? <SmallFastProgress />
          : 'Generate Schedules'}
      </Button>
      <GenericSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
    </div>
  );
};

export default GenerateSchedulesButton;
