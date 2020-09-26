import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';

import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../LandingPage/LandingPage';
import SchedulingPage from '../SchedulingPage/SchedulingPage';
import UnknownRoutePage from '../UnknownRoutePage/UnknownRoutePage';

const App: React.SFC = function App() {
  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Router>
          {/* One component for each page/route goes in here */}
          <LandingPage path="/" />
          <SchedulingPage path="/schedule" />
          <UnknownRoutePage default />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
