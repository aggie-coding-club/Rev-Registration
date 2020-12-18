import { Tooltip } from '@material-ui/core';
import { School } from '@material-ui/icons';
import * as React from 'react';

interface HonorsIconProps {
  fontSize?: 'inherit' | 'small' | 'default' | 'large';
}

const HonorsIcon: React.FC<HonorsIconProps> = ({ fontSize = 'small' }) => (
  <Tooltip title="Honors" placement="right">
    <School fontSize={fontSize} data-testid="honors" />
  </Tooltip>
);

export default HonorsIcon;
