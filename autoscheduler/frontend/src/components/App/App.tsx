import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch } from 'react-redux';

import theme from '../../theme';
import Schedule from '../Schedule/Schedule';
import * as styles from './App.css';
import fetchSavedSchedule from './testMeetings';
import { replaceMeetings } from '../../redux/actions';
import NavBar from '../NavBar';
import LandingPage from '../LandingPage/LandingPage';

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
        <NavBar />
        <Router>
          {/* One component for each page/route goes in here */}
          <LandingPage path="/" />
          <Schedule path="/schedule" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
