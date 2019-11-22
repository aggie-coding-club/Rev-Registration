import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme';
import LandingPage from './components/LandingPage/LandingPage';
import NavBar from './components/NavBar';

const App: React.SFC = function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Router>
          {/* One component for each page/route goes in here */}
          <LandingPage path="/" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
