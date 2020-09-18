import * as React from 'react';
import {
  Card, CardActions, CardContent, Button, Typography, Fade,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as styles from './InstructionsDialog.css';
import { RootState } from '../../../../redux/reducer';

const InstructionsDialog: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const hasCurrentAv = useSelector<RootState, boolean>(
    (state) => state.availability.length > 0,
  );
  // can have 1 of 3 values:
  // null -> user's first time on site
  // ''   -> user has not yet made an av
  // 'Y'  -> user has made an av or has manually dismissed dialog in the past
  const hasPastAv = localStorage.getItem('has-created-availability');
  // if the past availabilities is either null or '', update it
  if (!hasPastAv) {
    localStorage.setItem('has-created-availability', hasCurrentAv ? 'Y' : '');
  }
  // close the dialog if the user has ever created an av
  if ((hasCurrentAv || hasPastAv) && open) setOpen(false);

  // dismiss the dialog... forever!
  const handleOkClick = (): void => {
    localStorage.setItem('has-created-availability', 'Y');
    setOpen(false);
  };

  return (
    <Fade in={open}>
      <div className={styles.modalBackdrop}>
        <Card className={styles.availabilityDialog}>
          <CardContent>
            <Typography>
              Click and drag to block off times when you are unavailable,
              then press Generate Schedules
            </Typography>
          </CardContent>
          <CardActions className={styles.buttonsOnRight}>
            <Button onClick={handleOkClick} color="primary">OK</Button>
          </CardActions>
        </Card>
      </div>
    </Fade>
  );
};

export default InstructionsDialog;
