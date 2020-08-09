import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import { navigate } from '@reach/router';
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
  buttonText: {
    textTransform: 'capitalize',
  },
}));

const NavBar: React.SFC = () => {
  const classes = useStyles(appTheme);

  const [usersName, setUsersName] = React.useState('');
  const [loggedIn, setLoggedIn] = React.useState(false);

  function getLoggedIn(): void {
    fetch('sessions/get_is_logged_in').then(
      (res) => res.json(), // change to bool if possible. seems to be working though?
    ).then((result) => {
      if (result.is_logged_in) {
        setLoggedIn(result.is_logged_in);
      }
    });
  }

  function getUsersName(): void {
    fetch('sessions/get_full_name').then(
      (res) => res.json(),
    ).then((result) => {
      if (result.full_name) {
        setUsersName(result.full_name);
      }
    });
    if (usersName === '') {
      setUsersName('Google Login');// maybe remove at this point?
    }
  }
  getLoggedIn();
  getUsersName();

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
              <Typography variant="h6">
                Rev Registration
              </Typography>
            </Button>
          </div>
          {!loggedIn
            ? (
              <div>
                <Button
                  color="inherit"
                  onClick={(): void => {
                    window.open('/login/google-oauth2/', '_self');
                  }}
                >
                  Login With Google
                </Button>
              </div>
            )
            : (
              <div>
                {usersName/* make font prettier */}
                <Button
                  color="inherit"
                  onClick={(): void => {
                    window.open('/sessions/logout', '_self');
                  }}
                >
                  Logout
                </Button>
              </div>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
