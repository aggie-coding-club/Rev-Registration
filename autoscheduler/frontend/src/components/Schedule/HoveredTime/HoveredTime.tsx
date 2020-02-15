import * as React from 'react';
import * as styles from './HoveredTime.css';

interface HoveredTimeProps {
  mouseY: number;
  time: number;
}

const HoveredTime: React.FC<HoveredTimeProps> = ({ mouseY, time }): JSX.Element => (
  <div className={styles.container} style={{ top: mouseY - 20 }}>
    <div className={styles.marker} />
    <div className={styles.label}>
      {`${new Intl.DateTimeFormat('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })
        .format(new Date(1970, 0, 0, Math.floor(time / 60), time % 60)).slice(0, -3)}`}
    </div>
  </div>
);

export default HoveredTime;
