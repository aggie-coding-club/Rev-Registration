import * as React from 'react';
import { Router, Link } from '@reach/router';
import { AppBar, IconButton, Toolbar, Button } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { ThemeProvider } from '@material-ui/styles';

import theme from './theme';
import Empty from './components/Empty';
import NavBar from './Components/NavBar';
import HelpText from './Components/HelpText';
import SelectTerm from './Components/SelectTerm';

const App: React.SFC = function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <NavBar/>
        <HelpText/>
        <SelectTerm/>
        <Router>
          {/* One component for each page/route goes in here */}
          <Empty path="/" />
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
