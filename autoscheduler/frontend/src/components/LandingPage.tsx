import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

import NavBar from './NavBar';
import HelpText from './HelpText';
import SelectTerm from './SelectTerm';

const LandingPage: React.FC<RouteComponentProps> = () => (
  <div>
    <NavBar />
    <HelpText />
    <SelectTerm />
  </div>
);

export default LandingPage;
