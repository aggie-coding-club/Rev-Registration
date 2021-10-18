import * as React from 'react';
import {
  AppBar, Toolbar, Typography, Button, makeStyles, IconButton
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { navigate } from '@reach/router';
import LoginButton from './LoginButton';
import appTheme from '../../theme';
import SelectTerm from '../LandingPage/SelectTerm/SelectTerm';
import LastUpdatedAt from '../LastUpdatedAt';
import * as styles from './NavBar.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  title: {
    whiteSpace: 'nowrap',
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
    alignItems: 'center',
    minWidth: 0,
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
                  <img
                    src={`${STATIC_URL}/logo.png`}
                    alt="Logo"
                    style={{
                      width: 32,
                      height: 32,
                      paddingRight: 4,
                    }}
                  />
                  <Typography className={classes.title} variant="h6">
                    Rev Registration
                  </Typography>
                </Button>
              </div>
              <SelectTerm navBar />
              <LastUpdatedAt />
            </div>
            <div className={styles.rightNavbarContainer}>
              <IconButton className={styles.helpButton}
                          onClick={() => {
                            window.open('/howToUse','_blank');
                          }}>
                <HelpIcon/>
              </IconButton>
              <LoginButton />
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
