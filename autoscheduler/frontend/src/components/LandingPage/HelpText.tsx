import * as React from 'react';
import {
  Paper, Typography, Grid,
} from '@material-ui/core';

const HelpText: React.SFC = function App() {
  return (
    <Grid
      container
      direction="row"
      justify="space-around"
      alignItems="center"
      style={{ marginTop: '5%', marginBottom: '2%' }}
    >
      <Paper style={{ width: '55%', maxWidth: '800px' }}>
        <Typography
          variant="h3"
          align="center"
        >
            Guidelines
        </Typography>
        <Typography
          variant="body1"
          align="center"
        >
          Somebody once told me the world is gonna roll me
          I ain&apos;t the sharpest tool in the shed
          She was looking kind of dumb with her finger and her thumb
          In the shape of an &quot;L&quot; on her forehead
          Well the years start coming and they don&apos;t stop coming
          Fed to the rules and I hit the ground running
        </Typography>
      </Paper>
    </Grid>
  );
};

export default HelpText;
