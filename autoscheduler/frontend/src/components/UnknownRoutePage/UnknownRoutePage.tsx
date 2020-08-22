import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import LargeTextCard from '../LargeTextCard/LargeTextCard';
import * as styles from './UnknownRoutePage.css';

const UnknownRoutePage: React.FC<RouteComponentProps> = () => (
  <div className={styles.fillPage}>
    <LargeTextCard title="Page Not Found">
      Rev couldn&apos;t find the page you are looking for :(
      <br />
      <a href="/">Click here</a>
      {' '}
      to go back to the home page.
    </LargeTextCard>
  </div>
);

export default UnknownRoutePage;
