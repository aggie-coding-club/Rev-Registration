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

  // Determines whether to show the logout button and user's name
  // or the login button based on whether a user is logged in or not
  const userInformation = usersName ? (
    <div>
      {usersName}
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
    </div>
  ) : (
    <Button
      color="inherit"
      onClick={(): void => {
        window.open('/login/google-oauth2/', '_self');
      }}
    >
    Login With Google
    </Button>
  );


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
          <Typography variant="subtitle1">
            {userInformation}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
