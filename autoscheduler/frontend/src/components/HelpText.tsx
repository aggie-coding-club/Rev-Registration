import * as React from 'react';
import { Grid, Paper } from '@material-ui/core';

const HelpText: React.SFC = function App() {
  return (
    <Grid
      container
      spacing={0}
      direction="row"
      justify="space-around"
      alignItems="center"
      style={{ minHeight: '65vh' }}
    >
      <Paper style={{ width: '55%' }}>
        <h1>
          <Grid
            container
            spacing={0}
            direction="row"
            justify="space-around"
            alignItems="center"
          >
              Guidelines
          </Grid>
        </h1>
        <h2>
          <Grid
            container
            direction="column"
            alignItems="center"
          >
            <Grid item>
              Somebody once told me the world is gonna roll me
            </Grid>
            <Grid item>
              I ain&apos;t the sharpest tool in the shed
            </Grid>
            <Grid item>
              She was looking kind of dumb with her finger and her thumb
            </Grid>
            <Grid item>
              In the shape of an &quot;L&quot; on her forehead
            </Grid>
            <Grid item>
              Well the years start coming and they don&apos;t stop coming
            </Grid>
            <Grid item>
              Fed to the rules and I hit the ground running
            </Grid>
          </Grid>
        </h2>
      </Paper>
    </Grid>
  );
};

export default HelpText;
