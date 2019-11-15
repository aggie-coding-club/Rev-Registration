<<<<<<< HEAD
/* eslint-disable react/prop-types */
import * as React from 'react';

// insert a React component here
// the "Pure" component means it won't use state, only props
export default class MeetingCard extends React.PureComponent {

}
=======
import * as React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

import Meeting, { MeetingType } from '../types/Meeting';


interface MeetingCardProps {
  meeting: Meeting;
  bgColor: string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, bgColor }: MeetingCardProps) => {
  const style = {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    backgroundColor: bgColor,
    color: 'white',
    'text-align': 'center',
  };
  return (
    <Card style={style}>
      <CardContent>
        <Typography>
          {`${meeting.section.subject} ${meeting.section.courseNum}-${meeting.section.sectionNum}`}
        </Typography>
        <Typography>
          {MeetingType[meeting.meetingType]}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
>>>>>>> Created meeting card
