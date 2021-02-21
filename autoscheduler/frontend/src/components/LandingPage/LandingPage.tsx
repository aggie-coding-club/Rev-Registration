import * as React from 'react';
import { RouteComponentProps } from '@reach/router';

import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import About from './About/About';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';

const LandingPage: React.FC<RouteComponentProps> = () => (
  <div className={styles.container}>
    <HelpText />
    <SelectTerm />
    <div className={styles.dialogContainer}>
      <div className={styles.dialogLink}>
        <About />
        <PrivacyPolicy />
      </div>
    </div>
  </div>
);

export default LandingPage;
