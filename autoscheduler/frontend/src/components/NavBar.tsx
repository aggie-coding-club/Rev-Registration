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

  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  React.useEffect(() => {
    fetch('sessions/get_is_logged_in').then(
      (res) => res.json(),
    ).then(({ isLoggedIn }) => {
      if (isLoggedIn) setUserLoggedIn(isLoggedIn);
    });
  }, []);

  const [usersName, setUsersName] = React.useState('');
  React.useEffect(() => {
    fetch('sessions/get_full_name').then(
      (res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(res.status.toString());
      },
    ).then(({ fullName }) => {
      if (fullName) setUsersName(fullName);
    }).catch(() => { });
  }, []);

  function LoginButton() {
    return (
      <Button
        color="inherit"
        onClick={(): void => {
          window.open('/login/google-oauth2/', '_self');
        }}
      >
        Login With Google
      </Button>
    );
  }

  function LogoutButton() {
    return (
      <Button
        color="inherit"
        onClick={(): void => {
          window.open('/sessions/logout', '_self');
        }}
      >
        Logout
      </Button>
    );
  }


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
          {!userLoggedIn
            ? (
              <div>
                {LoginButton()}
              </div>
            )
            : (
              <div>
                {usersName/* make font prettier */}
                {LogoutButton()}
              </div>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
