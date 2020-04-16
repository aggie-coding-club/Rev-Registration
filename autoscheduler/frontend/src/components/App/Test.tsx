import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import SchedulePreview from '../SchedulingPage/SchedulePreview/SchedulePreview';
import ConfigureCard from '../SchedulingPage/ConfigureCard/ConfigureCard';

const Test: React.FC<RouteComponentProps> = () => (
  <>
    <ConfigureCard />
    <SchedulePreview />
  </>
);

export default Test;
