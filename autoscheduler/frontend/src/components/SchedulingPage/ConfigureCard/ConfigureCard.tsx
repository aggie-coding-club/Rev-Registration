import * as React from 'react';
import {
  Button, Checkbox, ListItem, ListItemIcon, ListItemText, Snackbar, IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import GenericCard from '../../GenericCard/GenericCard';
import SmallFastProgress from '../../SmallFastProgress';
import * as styles from './ConfigureCard.css';
import { generateSchedules } from '../../../redux/actions/schedules';
import useThunkDispatch from '../../../hooks/useThunkDispatch';

/**
 * Allows the user to configure global options for schedule generation. Includes a checkbox to
 * determine whether or not to include full sections and a button to generate schedules.
 */
const ConfigureCard: React.FC = () => {
  const [includeFull, setIncludeFull] = React.useState(false);
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

    dispatch(generateSchedules(includeFull))
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
        <ListItem
          disableGutters
          onClick={(): void => setIncludeFull(!includeFull)}
          style={{ cursor: 'pointer' }}
        >
          <ListItemIcon>
            <Checkbox color="primary" checked={includeFull} />
          </ListItemIcon>
          <ListItemText>
            Include full sections
          </ListItemText>
        </ListItem>
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
