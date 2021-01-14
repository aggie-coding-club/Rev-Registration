import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import About from './About/About';

const LandingPage: React.FC<RouteComponentProps> = () => (
  <div className={styles.container}>
    <HelpText />
    <SelectTerm />
    <About />
  </div>
);

export default LandingPage;
