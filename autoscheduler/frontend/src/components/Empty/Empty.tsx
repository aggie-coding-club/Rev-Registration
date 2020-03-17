import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import * as styles from './Empty.css';

const Empty: React.FC<RouteComponentProps> = () => (
  <div className={styles.empty}>
    Stuff
  </div>
);

export default Empty;
