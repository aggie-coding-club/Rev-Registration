import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import {
  Card, CardContent, IconButton, CardActions, Button, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Schedule from '../SchedulingPage/Schedule/Schedule';
import * as styles from './AvailabilityPage.css';

const AvailabilityPage: React.FC<RouteComponentProps> = () => (
  <div className={styles.pageContainer}>
    <Card className={styles.instructionsCard}>
      <CardContent>
        <Typography>
          Click and drag to mark times when you don&apos;t want to take classes
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <Button>Close</Button>
      </CardActions>
    </Card>
    <Schedule />
  </div>
);

export default AvailabilityPage;
