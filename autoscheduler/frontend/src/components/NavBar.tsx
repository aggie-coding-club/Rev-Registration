import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core';
// import GoogleLogin from './GoogleButton';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const style = {
    background : '#631717'
}

const NavBar: React.SFC = function App() {
  const classes = useStyles(useStyles);

  return (
    <div className={classes.root}>
      <AppBar position="static" style={style}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">

          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Aggie Scheduler
          </Typography>
          <Button
          color="inherit">
          Google Login</Button> //icon
        </Toolbar>
      </AppBar>
    </div>
  );
}
export default NavBar;
