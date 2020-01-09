import * as React from 'react';
import * as styles from './ScheduleCard.css';

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
  onResize?: (isBig: boolean) => void;
}

type ScheduleCardProps = React.PropsWithChildren<BasicProps>;

const ScheduleCard: React.FC<ScheduleCardProps> = ({
  startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes,
  borderColor, backgroundColor, backgroundStripes, firstHour, lastHour, children, onResize,
}) => {
  // tracks height of card and content, hiding meeting type if necessary
  const [isBig, setIsBig] = React.useState(true);
  const cardRoot = React.useRef<HTMLDivElement>(null);
  const cardContent = React.useRef<HTMLDivElement>(null);
  const updateIsBig = (newVal: boolean): void => {
    if (newVal !== isBig) {
      setIsBig(newVal);
      if (onResize) onResize(newVal);
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
    >
      <div className={styles.startTime} style={timeLabelStyle}>
        {`${formatHours(startTimeHours)}:${new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
          .format(startTimeMinutes)}`}
      </div>
      <div ref={cardContent}>
        {children}
      </div>
      <div className={styles.endTime} style={timeLabelStyle}>
        {`${formatHours(endTimeHours)}:${new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
          .format(endTimeMinutes)}`}
      </div>
    </div>
  );
};
export default ScheduleCard;
