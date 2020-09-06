import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
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

  // This checks for the logged in user's name and sets it if found.
  // Otherwise, it throws an error and catches it so nothing breaks.
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
        aria-label="Logout"
        title="Logout"
        onClick={(): void => {
          window.open('/sessions/logout', '_self');
        }}
      >
        <ExitToAppOutlinedIcon />

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
          {usersName === ''
            ? (
              <div>
                {LoginButton()}
              </div>
            )
            : (
              <div>
                <Typography variant="subtitle1">
                  {usersName/* make font prettier */}
                  {LogoutButton()}
                </Typography>
              </div>
            )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
