import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import LargeTextCard from '../LargeTextCard/LargeTextCard';
import * as styles from './UnknownRoutePage.css';

const UnknownRoutePage: React.FC<RouteComponentProps> = () => (
  <div className={styles.fillPage}>
    <LargeTextCard title="Page Not Found">
      Rev couldn&apos;t find the page you are looking for :(
      <br />
      However, she did find
      {' '}
      <a href="/">this link to the home page.</a>
    </LargeTextCard>
  </div>
);

export default UnknownRoutePage;
