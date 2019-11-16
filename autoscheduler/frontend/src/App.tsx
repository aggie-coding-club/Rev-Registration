import * as React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme';
import Empty from './components/Empty';
import NavBar from './components/NavBar';
import HelpText from './components/HelpText';
import SelectTerm from './components/SelectTerm';

const App: React.SFC = function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <NavBar />
        <HelpText />
        <SelectTerm />
        <Router>
          {/* One component for each page/route goes in here */}
          <Empty path="/" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
