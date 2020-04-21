import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import CourseSelectCard from '../CourseSelectColumn/CourseSelectCard/CourseSelectCard';

const Test: React.FC<RouteComponentProps> = () => (
  <CourseSelectCard id={0} />
);

export default Test;
