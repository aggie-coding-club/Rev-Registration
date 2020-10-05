import * as React from 'react';
import { Box, Typography, Paper } from '@material-ui/core';
import * as styles from './LargeTextCard.css';

interface LargeTextCardProps {
    title: string;
}

const LargeTextCard: React.FC<React.PropsWithChildren<LargeTextCardProps>> = (
  { title, children },
) => (
  <div className={styles.container}>
    <Paper classes={{ root: styles.paper }}>
      <Typography variant="h3" align="center">
        <Box padding={2} paddingTop={2} paddingBottom={0}>
          {title}
        </Box>
      </Typography>
      <Box padding={2} paddingTop={1} paddingBottom={4}>
        <Typography component="div" variant="body1" align="center">
          {children}
        </Typography>
      </Box>
    </Paper>
  </div>
);

export default LargeTextCard;
