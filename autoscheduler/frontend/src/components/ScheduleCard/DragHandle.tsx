import * as React from 'react';
import * as styles from './ScheduleCard.css';

interface DragHandleProps {
    top?: boolean;
    bot?: boolean;
    onDrag: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const DragHandle: React.FC<DragHandleProps> = ({
  top, bot, onDrag,
}) => {
  const [isMouseDown, setMouseDown] = React.useState(false);
  return (
    <div
      className={`${styles.dragHandle} ${top && styles.dragHandleTop} ${bot && styles.dragHandleBot}`}
      onMouseDown={(evt): void => {
        setMouseDown(true);
        evt.preventDefault();
      }}
      onMouseUp={(evt): void => {
        setMouseDown(false);
        evt.preventDefault();
      }}
      onMouseMove={(evt): any => isMouseDown || onDrag(evt)}
    />
  );
};

export default DragHandle;
