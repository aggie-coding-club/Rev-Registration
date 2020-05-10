import * as React from 'react';
import { CircularProgress } from '@material-ui/core';

const SmallFastProgress: React.FC = () => (
  <CircularProgress size={24} style={{ animationDuration: '550ms' }} disableShrink />
);

export default SmallFastProgress;
