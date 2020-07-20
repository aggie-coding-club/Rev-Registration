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

  function getUsersName(): void {
    fetch('sessions/get_full_name').then(
      (res) => res.json(),
    ).then((result) => {
      if (result.full_name) {
        setUsersName(result.full_name);
      }
    });
    if (usersName === '') {
      setUsersName('Google Login');
    }
  }

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

          <Button
            color="inherit"
            onClick={(): void => {
              window.open('/login/google-oauth2/', '_self');
            }}
          >
            {usersName}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
