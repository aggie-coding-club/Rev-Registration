import * as React from 'react';
import * as styles from './HoveredTime.css';
import { formatTime } from '../../../../utils/timeUtil';

interface HoveredTimeProps {
  mouseY: number;
  time: number;
}

const HoveredTime: React.FC<HoveredTimeProps> = ({ mouseY, time }): JSX.Element => (
  <div className={styles.container} style={{ top: mouseY - 20 }}>
    <div className={styles.marker} />
    <div className={styles.label}>
      {`${formatTime(Math.floor(time / 60), time % 60)}`}
    </div>
  </div>
);

export default HoveredTime;
