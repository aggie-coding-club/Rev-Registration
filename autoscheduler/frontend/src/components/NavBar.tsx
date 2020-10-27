import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import appTheme from '../theme';
import STATIC_URL from '../globals';

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

  const [usersName, setUsersName] = React.useState('Google Login');
  React.useEffect(() => {
    fetch('sessions/get_full_name').then(
      (res) => res.json(),
    ).then(({ fullName }) => {
      if (fullName) setUsersName(fullName);
    });
  }, []);

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
