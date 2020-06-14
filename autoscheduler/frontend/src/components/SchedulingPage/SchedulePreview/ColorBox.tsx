import * as React from 'react';
import * as styles from './SchedulePreview.css';

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <span className={styles.colorBox}>
    <span style={{ backgroundColor: color }} />
  </span>
);

export default ColorBox;
