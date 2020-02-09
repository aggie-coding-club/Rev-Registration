import * as React from 'react';
import * as styles from './ScheduleCard.css';

interface DragHandleProps {
    top?: boolean;
    bot?: boolean;
    onMouseDown: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
}

const DragHandle: React.FC<DragHandleProps> = ({
  top, bot, onMouseDown,
}) => (
  <div
    className={`${styles.dragHandle} ${top && styles.dragHandleTop} ${bot && styles.dragHandleBot}`}
    onMouseDown={onMouseDown}
  />
);

export default DragHandle;
