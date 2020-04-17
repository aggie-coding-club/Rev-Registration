import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import appTheme from '../theme';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar: React.SFC = () => {
  const classes = useStyles(appTheme);

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="primary"
      >
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
          >
            Rev Registration
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
