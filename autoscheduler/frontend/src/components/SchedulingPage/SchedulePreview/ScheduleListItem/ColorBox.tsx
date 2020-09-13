import * as React from 'react';
import * as styles from '../SchedulePreview.css';

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <span className={styles.colorBox} style={{ backgroundColor: color }} />
);

export default ColorBox;
