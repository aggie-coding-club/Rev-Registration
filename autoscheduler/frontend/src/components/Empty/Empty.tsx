import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import * as styles from './Empty.css';
import CourseSelectCard from '../CourseSelectCard/CourseSelectCard';

const Empty: React.FC<RouteComponentProps> = () => (
  <div className={styles.empty}>
    <CourseSelectCard id={0} />
  </div>
);

export default Empty;
