/* eslint-disable no-mixed-operators */
import * as React from 'react';
import { Typography } from '@material-ui/core';

import Meeting, { MeetingType } from '../types/Meeting';
import * as styles from './MeetingCard.css';


interface MeetingCardProps {
  meeting: Meeting;
  bgColor: string;
  firstHour: number;
  lastHour: number;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting, bgColor, firstHour, lastHour,
}: MeetingCardProps) => {
  // destructure meeting for ease of access
  const {
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, section, meetingType,
  } = meeting;

  // tracks height of card and content, hiding meeting type if necessary
  const [isBig, setIsBig] = React.useState(true);
  const cardRoot = React.useRef<HTMLDivElement>(null);
  const cardContent = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (cardContent.current.clientHeight > cardRoot.current.clientHeight) {
      setIsBig(false);
    }
  });

  const elapsedTime = endTimeHours * 60 + endTimeMinutes - startTimeHours * 60 - startTimeMinutes;
  const computedStyle = {
    height: `calc(${elapsedTime / (lastHour - firstHour) / 60 * 100}% - 4px)`, // 2*2px margin
    top: `${(startTimeHours * 60 + startTimeMinutes - firstHour * 60) / (lastHour - firstHour) / 60 * 100}%`,
    backgroundColor: bgColor,
  };

  return (
    <div className={styles.meetingCard} style={computedStyle} ref={cardRoot}>
      <div className={styles.startTime} style={{ borderColor: bgColor }}>
        {`${startTimeHours}:${new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
          .format(startTimeMinutes)}`}
      </div>
      <div ref={cardContent}>
        <Typography variant="body2">
          {`${section.subject} ${section.courseNum}-${section.sectionNum}`}
        </Typography>
        <Typography variant="subtitle2" hidden={!isBig}>
          {MeetingType[meetingType]}
        </Typography>
      </div>
      <div className={styles.endTime} style={{ borderColor: bgColor }}>
        {`${endTimeHours}:${new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 })
          .format(endTimeMinutes)}`}
      </div>
    </div>
  );
};

export default MeetingCard;
