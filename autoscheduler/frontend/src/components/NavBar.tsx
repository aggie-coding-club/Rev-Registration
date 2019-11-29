import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import appTheme from '../theme';

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
  const classes = useStyles(appTheme);

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
          >
            <MenuIcon />
          </IconButton>
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
