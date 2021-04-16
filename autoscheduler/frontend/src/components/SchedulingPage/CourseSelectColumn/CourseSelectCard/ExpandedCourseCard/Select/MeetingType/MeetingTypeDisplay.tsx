import { Tooltip } from '@material-ui/core';
import * as React from 'react';
import Meeting, { MeetingType, MeetingTypeDescription } from '../../../../../../../types/Meeting';
import * as styles from '../Select.css';

interface MeetingTypeDisplayProps {
  meeting: Meeting;
}

const MeetingTypeDisplay: React.FC<MeetingTypeDisplayProps> = ({ meeting }) => {
  const meetingTypeDescription = MeetingTypeDescription.get(meeting.meetingType);

  if (meetingTypeDescription) {
    return (
      <Tooltip title={meetingTypeDescription} arrow placement="bottom" PopperProps={{ disablePortal: true }}>
        <span className={styles.meetingType}>{MeetingType[meeting.meetingType]}</span>
      </Tooltip>
    );
  }

  return (
    <span>
      {MeetingType[meeting.meetingType]}
    </span>
  );
};

export default MeetingTypeDisplay;
