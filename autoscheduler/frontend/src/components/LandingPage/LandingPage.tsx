import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

import HelpText from './HelpText';
import SelectTerm from './SelectTerm';

const LandingPage: React.FC<RouteComponentProps> = () => (
  <div>
    <HelpText />
    <SelectTerm />
  </div>
);

export default LandingPage;
