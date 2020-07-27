import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import LargeTextCard from '../LargeTextCard/LargeTextCard';
import * as styles from './UnknownRoutePage.css';

const UnknownRoutePage: React.FC<RouteComponentProps> = () => (
  <div className={styles.fillPage}>
    <LargeTextCard
      title="Page Not Found"
      body="Rev couldn't find the page you are looking for :("
    />
  </div>
);

export default UnknownRoutePage;
