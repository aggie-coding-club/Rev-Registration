import { Tooltip } from '@material-ui/core';
import { School } from '@material-ui/icons';
import * as React from 'react';

interface HonorsIconProps {
  fontSize?: 'inherit' | 'small' | 'default' | 'large';
  color?: 'primary' | 'secondary' | 'action';
}

const HonorsIcon: React.FC<HonorsIconProps> = ({ fontSize = 'small', color }) => (
  <Tooltip title="Honors" placement="right">
    <School fontSize={fontSize} data-testid="honors" color={color} />
  </Tooltip>
);

export default HonorsIcon;
