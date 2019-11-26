import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
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

const NavBar: React.SFC = function App() {
  const classes = useStyles(useStyles);

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="primary"
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          />
          <Typography
            variant="h6"
            className={classes.title}
          >
            Cool Scheduler
          </Typography>
          <Button
            color="inherit"
          >
            Google Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
