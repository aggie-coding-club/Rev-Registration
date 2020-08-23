import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';
import StepButton from './StepButton';
import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../LandingPage/LandingPage';
import CourseSelectPage from '../CourseSelectPage/CourseSelectPage';
import AvailabilityPage from '../AvailabilityPage/AvailabilityPage';
import SchedulesPage from '../SchedulesPage/SchedulesPage';
import CustomizeSchedulePage from '../CustomizeSchedulePage/CustomizeSchedulePage';
import { StepContext } from '../NavBar/stepManager';
import steps from '../NavBar/steps';
import SchedulingPage from '../SchedulingPage/SchedulingPage';

const App: React.SFC = function App() {
  const [activeStep, _setActiveStep] = React.useState(
    steps.findIndex(({ link }) => link === window.location.pathname),
  );
  const [skippedSteps, setSkippedSteps] = React.useState(new Set<number>());
  const ctxValue = React.useMemo(
    () => [activeStep, _setActiveStep, skippedSteps, setSkippedSteps],
    [activeStep, skippedSteps],
  );

  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <StepContext.Provider value={ctxValue}>
          <NavBar />
          <Router>
            {/* One component for each page/route goes in here */}
            <LandingPage path="/" />
            <SchedulingPage path="/schedule" />
            {/* Pages for multi-page layout */}
            <CourseSelectPage path="/select-courses" />
            <AvailabilityPage path="/select-times" />
            <SchedulesPage path="/schedules" />
            <CustomizeSchedulePage path="/customize-schedule" />
          </Router>
          <StepButton />
        </StepContext.Provider>
      </ThemeProvider>
    </div>
  );
};

export default App;
