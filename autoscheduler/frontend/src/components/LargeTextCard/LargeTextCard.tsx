import * as React from 'react';
import { Box, Typography, Paper } from '@material-ui/core';
import * as styles from './LargeTextCard.css';

interface LargeTextCardProps {
    title: string;
    body: string;
}

const LargeTextCard: React.FC<LargeTextCardProps> = ({ title, body }) => (
  <div className={styles.container}>
    <Paper style={{ width: '55%', maxWidth: '800px' }}>
      <Typography variant="h3" align="center">
        <Box padding={2} paddingTop={2} paddingBottom={0}>
          {title}
        </Box>
      </Typography>
      <Box padding={2} paddingTop={1} paddingBottom={4}>
        <Typography variant="body1" align="center">
          {body}
        </Typography>
      </Box>
    </Paper>
  </div>
);

export default LargeTextCard;
