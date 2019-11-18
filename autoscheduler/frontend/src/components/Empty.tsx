import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import * as styles from './Empty.css';

const Empty: React.FC<RouteComponentProps> = () => (
  <div className={styles.empty}>
    Oi, put stuff here.
  </div>
);

export default Empty;
