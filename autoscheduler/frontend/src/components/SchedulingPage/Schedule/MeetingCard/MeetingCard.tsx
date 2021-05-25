import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './MeetingCard.css';
import Meeting, { MeetingType } from '../../../../types/Meeting';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import meetingTimeText from '../../../../utils/meetingTimeText';
import { meetingBuildingWithRoom } from '../../../../utils/meetingBuilding';

interface MeetingCardProps {
  meeting: Meeting;
  bgColor: string;
  firstHour: number;
  lastHour: number;
  fullscreen?: boolean;
}

/**
 * Renders a meeting of a class on the schedule
 * @param props include meeting, bgColor, firstHour, and lastHour
 */
const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting, bgColor, firstHour, lastHour, fullscreen = false,
}: MeetingCardProps) => {
  // destructure meeting for ease of access
  const {
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, section, meetingType,
  } = meeting;
  const [isBig, setIsBig] = React.useState(true);

  // hide meeting type if the card is small
  const handleResize = React.useCallback((newVal: boolean): void => {
    setIsBig(newVal);
  }, []);

  // TODO: Find cases where this isn't true
  const fullscreenCard = (
    <>
      <Typography variant="body2" data-testid="meeting-card-primary-content" className={styles.meetingCardText}>
        {`${section.subject} ${section.courseNum}`}
        {`-${section.sectionNum}`}
        &nbsp;
        &bull;
        <Typography variant="subtitle2" component="span">
          &nbsp;
          {`${MeetingType[meetingType]}`}
        </Typography>
      </Typography>
      <Typography variant="subtitle2" style={{ display: isBig ? 'block' : 'none' }}>
        {meetingBuildingWithRoom(meeting)}
      </Typography>
      <Typography variant="body2" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {isBig ? null : (
          <>
            <Typography variant="subtitle2" style={{ display: 'block' }} component="span">
              {meetingBuildingWithRoom(meeting)}
            </Typography>
            &nbsp;
            &bull;
            &nbsp;
          </>
        )}
        {meetingTimeText(meeting)}
      </Typography>
    </>
  );

  const normal = (
    <>
      <Typography variant="body2" data-testid="meeting-card-primary-content" className={styles.meetingCardText}>
        {`${section.subject} ${section.courseNum}`}
        {isBig
          ? `-${section.sectionNum}`
          : (
            <Typography variant="subtitle2" component="span">
              &nbsp;
              {`${MeetingType[meetingType]}`}
            </Typography>
          )}
      </Typography>
      <Typography variant="subtitle2" style={{ display: isBig ? 'block' : 'none' }}>
        {MeetingType[meetingType]}
      </Typography>
    </>
  );

  return (
    <ScheduleCard
      startTimeHours={startTimeHours}
      startTimeMinutes={startTimeMinutes}
      endTimeHours={endTimeHours}
      endTimeMinutes={endTimeMinutes}
      firstHour={firstHour}
      lastHour={lastHour}
      onResizeWindow={
        (contentHeight, clientHeight): void => handleResize(contentHeight < clientHeight - 15)
      }
      backgroundColor={bgColor}
      borderColor={bgColor}
    >
      {fullscreen ? fullscreenCard : normal}
    </ScheduleCard>
  );
};

export default MeetingCard;
