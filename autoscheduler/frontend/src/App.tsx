import * as React from 'react';
import { Router, Link } from '@reach/router';

import Empty from './components/Empty';

const App: React.SFC = function App() {
  return (
    <div>
      {/* Once we add material-ui, the nav bar will probably replace this link */}
      <Link to="/">Home</Link>
      <Router>
        {/* One component for each page/route goes in here */}
        <Empty path="/" />
      </Router>
    </div>
  );
};

export default App;
