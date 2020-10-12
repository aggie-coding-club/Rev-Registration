import * as React from 'react';
import {
  Button, Checkbox, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import GenericCard from '../../GenericCard/GenericCard';
import SmallFastProgress from '../../SmallFastProgress';
import * as styles from './ConfigureCard.css';
import { generateSchedules } from '../../../redux/actions/schedules';

/**
 * Allows the user to configure global options for schedule generation. Includes a checkbox to
 * determine whether or not to include full sections and a button to generate schedules.
 */
const ConfigureCard: React.FC = () => {
  const [includeFull, setIncludeFull] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  // Holds a reference to the DOM element to check if the component is still mounted
  const isMounted = React.useRef(true);
  React.useEffect((): VoidFunction => (): void => {
    isMounted.current = false;
  }, []);

  const fetchSchedules = React.useCallback(() => {
    // show loading indicator
    setLoading(true);

    dispatch(generateSchedules(includeFull));
  }, [dispatch, includeFull]);

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
          color="primary"
          onClick={fetchSchedules}
          disabled={loading}
        >
          {loading
            ? <SmallFastProgress />
            : 'Generate Schedules'}
        </Button>
      </div>
    </GenericCard>
  );
};

export default ConfigureCard;
