import * as React from 'react';
import * as styles from './ScheduleCard.css';
import { formatTime } from '../../../timeUtil';

interface DragHandleProps {
    top?: boolean;
    bot?: boolean;
    onMouseDown: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => any;
    time: number;
}

const DragHandle: React.FC<DragHandleProps> = ({
  top, bot, onMouseDown, time,
}) => (
  <div
    className={`${styles.dragHandle} ${top && styles.dragHandleTop} ${bot && styles.dragHandleBot}`}
    onMouseDown={onMouseDown}
    role="slider"
    aria-label={`Adjust ${top ? 'Start' : 'End'} Time`}
    aria-valuemin={48}
    aria-valuemax={126}
    aria-valuenow={time / 10}
    aria-valuetext={`${formatTime(Math.floor(time / 60), time % 60)}`}
    tabIndex={0}
  />
);

export default DragHandle;
