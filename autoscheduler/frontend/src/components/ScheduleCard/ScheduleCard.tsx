import * as React from 'react';
import { useSelector } from 'react-redux';
import * as styles from './ScheduleCard.css';
import DragHandle from './DragHandle';
import { RootState } from '../../redux/reducers';
import { AvailabilityArgs } from '../../types/Availability';

let contentHeight: number = null;

interface BasicProps {
  startTimeHours: number;
  startTimeMinutes: number;
  endTimeHours: number;
  endTimeMinutes: number;
  borderColor?: string;
  backgroundColor?: string;
  backgroundStripes?: boolean;
  firstHour: number;
  lastHour: number;
  onResizeWindow?: (isBig: boolean) => void;
  onDragHandleDown?: (evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
    endSelected: boolean) => void;
}

type ScheduleCardProps = React.PropsWithChildren<BasicProps>;

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  borderColor, backgroundColor, backgroundStripes, firstHour, lastHour, children,
  onResizeWindow, onDragHandleDown,
}) => {
  const selectedAvailability = useSelector<RootState, AvailabilityArgs>(
    (state) => state.selectedAvailability,
  );
  // tracks height of card and content, hiding meeting type if necessary
  const [isBig, setIsBig] = React.useState(true);
  const [isHovered, setHovered] = React.useState(false);
  const [isMouseDown, setMouseDown] = React.useState(!!selectedAvailability);
  const cardRoot = React.useRef<HTMLDivElement>(null);
  const cardContent = React.useRef<HTMLDivElement>(null);
  const updateIsBig = (newVal: boolean): void => {
    if (newVal !== isBig) {
      setIsBig(newVal);
      if (onResizeWindow) onResizeWindow(newVal);
    }
  };
  React.useEffect(() => {
    const handleResize = (): void => {
      // set initial height for future use
      contentHeight = contentHeight || cardContent.current.clientHeight;

      if (contentHeight >= cardRoot.current.clientHeight) {
        updateIsBig(false);
      } else {
        updateIsBig(true);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    return (): void => window.removeEventListener('resize', handleResize);
  }, []);
  // watch for when the user stops dragging this card
  if (!selectedAvailability && isMouseDown) setMouseDown(false);

  const elapsedTime = endTimeHours * 60 + endTimeMinutes - startTimeHours * 60 - startTimeMinutes;
  const computedStyle: React.CSSProperties = {
    height: `calc(${elapsedTime / (lastHour - firstHour) / 60 * 100}% - 4px)`, // 2*2px margin
    top: `${(startTimeHours * 60 + startTimeMinutes - firstHour * 60) / (lastHour - firstHour) / 60 * 100}%`,
    background: backgroundStripes ? `repeating-linear-gradient(-45deg, ${
      backgroundColor}, ${backgroundColor} 5px, white 5px, white 20px)` : undefined,
    backgroundColor: backgroundStripes ? undefined : backgroundColor,
    border: `2px solid ${borderColor || backgroundColor}`,
  };
  const timeLabelStyle = {
    borderColor,
    display: isHovered || isMouseDown ? 'block' : 'none',
  };

  // helper functions for formatting
  function formatHours(hours: number): number {
    return ((hours - 1) % 12) + 1;
  }

  return (
    <div
      className={styles.meetingCard}
      style={computedStyle}
      ref={cardRoot}
      onMouseEnter={(): void => setHovered(true)}
      onMouseLeave={(): void => setHovered(false)}
    >
      <div className={styles.startTime} style={timeLabelStyle}>
        {`${formatHours(startTimeHours)}:${new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
          .format(startTimeMinutes)}`}
      </div>
      {onDragHandleDown
        ? (
          <DragHandle
            top
            onMouseDown={(evt): void => {
              setMouseDown(true);
              onDragHandleDown(evt, false);
            }}
            time={startTimeHours * 60 + startTimeMinutes}
          />
        )
        : null}
      <div ref={cardContent}>
        {children}
      </div>
      {onDragHandleDown
        ? (
          <DragHandle
            bot
            onMouseDown={(evt): void => {
              setMouseDown(true);
              onDragHandleDown(evt, true);
            }}
            time={endTimeHours * 60 + endTimeMinutes}
          />
        )
        : null}
      <div className={styles.endTime} style={timeLabelStyle}>
        {`${formatHours(endTimeHours)}:${new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
          .format(endTimeMinutes)}`}
      </div>
    </div>
  );
};
export default ScheduleCard;
