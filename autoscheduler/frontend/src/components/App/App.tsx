import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';

import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../LandingPage/LandingPage';
import CourseSelectPage from '../CourseSelectPage/CourseSelectPage';
import AvailabilityPage from '../AvailabilityPage/AvailabilityPage';
import SchedulesPage from '../SchedulesPage/SchedulesPage';
import CustomizeSchedulePage from '../CustomizeSchedulePage/CustomizeSchedulePage';

const App: React.SFC = function App() {
  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Router>
          {/* One component for each page/route goes in here */}
          <LandingPage path="/" />
          <CourseSelectPage path="/select-courses" />
          <AvailabilityPage path="/select-times" />
          <SchedulesPage path="/schedules" />
          <CustomizeSchedulePage path="/customize-schedule" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
