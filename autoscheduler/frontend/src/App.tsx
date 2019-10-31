import * as React from 'react';
import { Router, Link } from '@reach/router';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';

import Empty from './components/Empty';

const App: React.SFC = function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <Link to="/">
              <HomeIcon />
            </Link>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Router>
        {/* One component for each page/route goes in here */}
        <Empty path="/" />
      </Router>
    </div>
  );
};

export default App;
