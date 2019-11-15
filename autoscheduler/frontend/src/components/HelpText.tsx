import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';

const style = {
  height: 350,
  width: 650
}

const centerText = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

const HelpText: React.SFC = function App() {
  return (

    <Grid
    container
    spacing={0}
    direction="row"
    justify="space-around"
    alignItems="center"
    style={{ minHeight: '75vh' }}>

      <Paper style={style}>
        <h1>
          <Grid
          container
          spacing={0}
          direction="row"
          justify="space-around"
          alignItems="center">
            Guidelines
          </Grid>
        </h1>
        <h2 text-align = "center">
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
            Somebody once told me the world is gonna roll me
            I ain't the sharpest tool in the shed
            She was looking kind of dumb with her finger and her thumb
            In the shape of an "L" on her forehead
            Well the years start coming and they don't stop coming
            Fed to the rules and I hit the ground running
            Didn't make sense not to live for fun
            Your brain gets smart but your head gets dumb
          </div>
        </h2>
      </Paper>
    </Grid>
  );
}

export default HelpText;
