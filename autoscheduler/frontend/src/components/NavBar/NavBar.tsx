import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles,
} from '@material-ui/core';
import { navigate } from '@reach/router';
import appTheme from '../../theme';
import NavStepper from './NavStepper';

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
}));

const NavBar: React.FC = () => {
  const classes = useStyles(appTheme);

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="primary"
      >
        <Toolbar>
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
          <NavStepper />
          <Button
            color="inherit"
            onClick={(): void => {
              window.open('/login/google-oauth2/', '_self');
            }}
          >
            Google Login
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
