import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';

import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar';
import LandingPage from '../LandingPage/LandingPage';
import SchedulingPage from '../SchedulingPage/SchedulingPage';

const App: React.SFC = function App() {
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
