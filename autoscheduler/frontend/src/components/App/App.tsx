import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';
import Div100vh from 'react-div-100vh';

import theme from '../../theme';
import * as styles from './App.css';
import NavBar from '../NavBar/NavBar';
import LandingPage from '../LandingPage/LandingPage';
import SchedulingPage from '../SchedulingPage/SchedulingPage';
import UnknownRoutePage from '../UnknownRoutePage/UnknownRoutePage';

const App: React.FC = function App() {
  React.useEffect(() => {
    const takeFullHeight = (): void => { document.body.style.height = `${window.innerHeight}px`; };
    window.onresize = takeFullHeight;
    return (): void => { window.removeEventListener('resize', takeFullHeight); };
  }, []);

  return (
    <Div100vh className={styles.appContainer}>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Router className={styles.router}>
          {/* One component for each page/route goes in here */}
          <LandingPage path="/" />
          <SchedulingPage path="/schedule" />
          <UnknownRoutePage default />
        </Router>
      </ThemeProvider>
    </Div100vh>
  );
};

export default App;
