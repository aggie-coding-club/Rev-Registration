import * as React from 'react';
import { Router, Link } from '@reach/router';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { ThemeProvider } from '@material-ui/styles';

import { useDispatch } from 'react-redux';
import theme from '../theme';
import Empty from '../components/Empty/Empty';
import Schedule from '../components/Schedule/Schedule';
import * as styles from './App.css';
import fetchSavedSchedule from './testMeetings';
import { replaceMeetings } from '../redux/actions';

const App: React.SFC = function App() {
  // connect to Redux store
  const dispatch = useDispatch();

  // load initial schedule from server
  React.useEffect(() => {
    fetchSavedSchedule().then(
      (meetings) => dispatch(replaceMeetings(meetings)),
    );
  }, []);

  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start">
              <Link to="/">
                <HomeIcon color="secondary" />
              </Link>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Router>
          {/* One component for each page/route goes in here */}
          <Empty path="/" />
          <Schedule path="/schedule" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
