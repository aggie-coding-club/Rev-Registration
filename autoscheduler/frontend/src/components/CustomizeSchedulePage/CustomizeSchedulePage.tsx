import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import CourseSelectColumn from '../SchedulingPage/CourseSelectColumn/CourseSelectColumn';
import Schedule from '../SchedulingPage/Schedule/Schedule';

const CustomizeSchedulePage: React.FC<RouteComponentProps> = () => (
  <div>
    <CourseSelectColumn />
    <Schedule />
  </div>
);

export default CustomizeSchedulePage;
