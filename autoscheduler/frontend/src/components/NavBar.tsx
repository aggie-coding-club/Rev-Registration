import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import appTheme from '../theme';
import SelectTerm from './LandingPage/SelectTerm/SelectTerm';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  buttonText: {
    textTransform: 'capitalize',
  },
  navBarFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },

  titleAndSelectTerm: {
    display: 'flex',
    width: '50%',
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
          <div className={classes.navBarFlex}>
            <div className={classes.titleAndSelectTerm}>
              <div>
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
              <SelectTerm navBar />
            </div>

            <Button
              color="inherit"
              onClick={(): void => {
                window.open('/login/google-oauth2/', '_self');
              }}
            >
              {usersName}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
