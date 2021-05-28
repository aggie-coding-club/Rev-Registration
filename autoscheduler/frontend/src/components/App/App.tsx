import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';

import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../LandingPage/LandingPage';
import SchedulingPage from '../SchedulingPage/SchedulingPage';
import UnknownRoutePage from '../UnknownRoutePage/UnknownRoutePage';
import InfoPage from '../InfoPage/InfoPage';

const App: React.SFC = function App() {
  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <div className={styles.scroll}>
          <NavBar />
          <Router className={styles.router}>
            {/* One component for each page/route goes in here */}
            <LandingPage path="/" />
            <SchedulingPage path="/schedule" />
            <InfoPage path="/info" />
            <UnknownRoutePage default />
          </Router>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default App;
