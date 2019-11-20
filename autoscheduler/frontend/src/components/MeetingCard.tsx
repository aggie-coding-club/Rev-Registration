/* eslint-disable no-mixed-operators */
import * as React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

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

  const elapsedTime = endTimeHours * 60 + endTimeMinutes - startTimeHours * 60 - startTimeMinutes;
  const computedStyle = {
    height: `${elapsedTime / (lastHour - firstHour) / 60 * 100}%`,
    top: `${(startTimeHours * 60 + startTimeMinutes - firstHour * 60) / (lastHour - firstHour) / 60 * 100}%`,
    backgroundColor: bgColor,
  };

  return (
    <Card className={styles.meetingCard} style={computedStyle}>
      <CardContent>
        <Typography>
          {`${section.subject} ${section.courseNum}-${section.sectionNum}`}
        </Typography>
        <Typography>
          {MeetingType[meetingType]}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
