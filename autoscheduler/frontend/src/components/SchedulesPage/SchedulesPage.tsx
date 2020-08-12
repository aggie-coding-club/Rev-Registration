import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import SchedulePreview from '../SchedulingPage/SchedulePreview/SchedulePreview';
import Schedule from '../SchedulingPage/Schedule/Schedule';

const SchedulesPage: React.FC<RouteComponentProps> = () => (
  <div>
    <SchedulePreview />
    <Schedule />
  </div>
);

export default SchedulesPage;
