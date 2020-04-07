import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';
import { useDispatch } from 'react-redux';

import theme from '../../theme';
import * as styles from './App.css';
import fetchSavedSchedule from './testMeetings';
import NavBar from '../NavBar';
import LandingPage from '../LandingPage/LandingPage';
import Test from './Test';
import SchedulingPage from '../SchedulingPage/SchedulingPage';
import { addSchedule } from '../../redux/actions/schedules';
import selectSchedule from '../../redux/actions/selectedSchedule';

const App: React.SFC = function App() {
  // connect to Redux store
  const dispatch = useDispatch();

  // load initial schedule from server
  React.useEffect(() => {
    fetchSavedSchedule().then(
      (meetings) => {
        dispatch(addSchedule(meetings));
        dispatch(selectSchedule(0));
      },
    );
  }, []);

  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Router>
          {/* One component for each page/route goes in here */}
          <LandingPage path="/" />
          <SchedulingPage path="/schedule" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
