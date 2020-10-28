import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import LoginButton from './LoginButton';
import appTheme from '../../theme';
import STATIC_URL from '../../globals';

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
  buttonText: {
    textTransform: 'capitalize',
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
          <div className={classes.title}>
            <Button
              color="inherit"
              classes={{ label: classes.buttonText }}
              onClick={(): void => {
                // Navigate to the root when the title is clicked
                navigate('/');
              }}
            >
              <img
                src={`${STATIC_URL}/logo.png`}
                alt="Logo"
                style={{
                  width: 32,
                  height: 32,
                  paddingRight: 4,
                }}
              />
              <Typography variant="h6">
                Rev Registration
              </Typography>
            </Button>
          </div>
          <LoginButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
