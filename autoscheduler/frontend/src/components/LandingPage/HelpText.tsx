import * as React from 'react';
import {
  Paper, Typography, Grid, Box,
} from '@material-ui/core';

const HelpText: React.SFC = () => (
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
        <Box padding={2} paddingTop={4} paddingBottom={0}>
            Guidelines
        </Box>
      </Typography>
      <Box padding={2}>
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
            Somebody once told me the world is gonna roll me
            I ain&apos;t the sharpest tool in the shed
            She was looking kind of dumb with her finger and her thumb
            In the shape of an &quot;L&quot; on her forehead
            Well the years start coming and they don&apos;t stop coming
            Fed to the rules and I hit the ground running
        </Typography>
      </Box>
    </Paper>
  </Grid>
);

export default HelpText;
