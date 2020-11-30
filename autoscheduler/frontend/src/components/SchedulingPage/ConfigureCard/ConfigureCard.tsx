import * as React from 'react';
import {
  Button, Snackbar, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GenericCard from '../../GenericCard/GenericCard';
import SmallFastProgress from '../../SmallFastProgress';
import * as styles from './ConfigureCard.css';
import { generateSchedules } from '../../../redux/actions/schedules';
import useThunkDispatch from '../../../hooks/useThunkDispatch';

/**
 * Just the geneate Schedules Button
 */
const ConfigureCard: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const dispatch = useThunkDispatch();

  // Holds a reference to the DOM element to check if the component is still mounted
  const isMounted = React.useRef(true);
  React.useEffect((): VoidFunction => (): void => {
    isMounted.current = false;
  }, []);

  // closes the snackbar if the user presses the close icon, but not if they click away
  const handleSnackbarClose = (_event: any, reason: string): void => {
    if (reason === 'clickaway') return;
    setSnackbarMessage('');
  };

  const fetchSchedules = (): void => {
    // show loading indicator
    setLoading(true);

    dispatch(generateSchedules())
      .catch((e: Error) => setSnackbarMessage(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <GenericCard
      header={
        <div id={styles.cardHeader}>Configure</div>
      }
    >
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
        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={5000}
          message={snackbarMessage}
          onClose={handleSnackbarClose}
          action={(
            <IconButton aria-label="close" onClick={(): void => setSnackbarMessage('')}>
              <CloseIcon fontSize="small" style={{ color: 'white' }} />
            </IconButton>
        )}
        />
      </div>
    </GenericCard>
  );
};

export default ConfigureCard;
