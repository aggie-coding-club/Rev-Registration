import * as React from 'react';
import {
  Card, CardActions, CardContent, Button, Typography, Fade,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as styles from './InstructionsDialog.css';
import { RootState } from '../../../../redux/reducer';

const InstructionsDialog: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const hasGeneratedSchedules = useSelector<RootState, boolean>(
    (state) => state.availability.length > 0 || state.schedules.allSchedules.length > 0,
  );
  if (hasGeneratedSchedules && open) setOpen(false);

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
            <Button onClick={(): void => setOpen(false)} color="primary">OK</Button>
          </CardActions>
        </Card>
      </div>
    </Fade>
  );
};

export default InstructionsDialog;
