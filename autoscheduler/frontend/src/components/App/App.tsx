import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';
import { useSelector } from 'react-redux';

import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../LandingPage/LandingPage';
import SchedulingPage from '../SchedulingPage/SchedulingPage';
import UnknownRoutePage from '../UnknownRoutePage/UnknownRoutePage';
import { RootState } from '../../redux/reducer';

const App: React.SFC = function App() {
  const fullscreen = useSelector<RootState, boolean>((state) => state.fullscreen);

  return (
    <div className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Router className={styles.router}>
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
