import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './MeetingCard.css';
import Meeting, { MeetingType } from '../../../../types/Meeting';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import meetingTimeText from '../../../../utils/meetingTimeText';
import { meetingBuildingWithRoom } from '../../../../utils/meetingBuilding';

enum MeetingCardSizes {
  small, // 1 line, for <50 minute meetings
  medium, // 2 lines
  large // 3 lines
}

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
  const [cardSize, setCardSize] = React.useState(MeetingCardSizes.large);

  // Determines what size the card is, depending on the difference between the desired and available
  // height.
  const handleResize = React.useCallback((contentHeight: number, clientHeight: number): void => {
    const heightDiff = clientHeight - contentHeight;
    if (heightDiff > 30) {
      setCardSize(MeetingCardSizes.large);
    } else if (heightDiff > -15) { // Just enough for two rows of text
      setCardSize(MeetingCardSizes.medium);
    } else {
      setCardSize(MeetingCardSizes.small);
    }
  }, []);

  const fullscreenLargeCard = (
    <>
      <Typography variant="body2" className={styles.meetingCardText}>
        {`${section.subject} ${section.courseNum}`}
        {`-${section.sectionNum}`}
        &nbsp;
        &bull;
        &nbsp;
        <Typography variant="subtitle2" component="span">
          {`${MeetingType[meetingType]}`}
        </Typography>
      </Typography>
      <Typography variant="subtitle2">
        {meetingBuildingWithRoom(meeting)}
      </Typography>
      <Typography variant="body2" className={styles.meetingCardText}>
        {meetingTimeText(meeting)}
      </Typography>
    </>
  );

  const fullscreenMediumCard = (
    <>
      <Typography variant="body2" className={styles.meetingCardText}>
        {`${section.subject} ${section.courseNum}`}
        {`-${section.sectionNum}`}
        &nbsp;
        &bull;
        &nbsp;
        <Typography variant="subtitle2" component="span">
          {`${MeetingType[meetingType]}`}
        </Typography>
      </Typography>
      <Typography variant="body2" className={styles.meetingCardText}>
        <>
          <Typography variant="subtitle2" component="span">
            {meetingBuildingWithRoom(meeting)}
          </Typography>
          &nbsp;
          &bull;
          &nbsp;
        </>
        {meetingTimeText(meeting)}
      </Typography>
    </>
  );

  const fullscreenSmallCard = (
    <>
      <Typography variant="body2" className={styles.meetingCardText}>
        {`${section.subject} ${section.courseNum}`}
        {`-${section.sectionNum}`}
        &nbsp;
        &bull;
        &nbsp;
        <Typography variant="subtitle2" component="span">
          {meetingBuildingWithRoom(meeting)}
        </Typography>
      </Typography>
    </>
  );

  // Determine which size of fullscreen card to use
  let fullscreenCard = null;
  switch (cardSize) {
    case MeetingCardSizes.large:
      fullscreenCard = fullscreenLargeCard;
      break;
    case MeetingCardSizes.medium:
      fullscreenCard = fullscreenMediumCard;
      break;
    case MeetingCardSizes.small:
      fullscreenCard = fullscreenSmallCard;
      break;
    default:
      break;
  }

  const normal = (
    <>
      <Typography
        variant="body2"
        data-testid="meeting-card-primary-content"
        className={styles.meetingCardText}
      >
        {`${section.subject} ${section.courseNum}`}
        {cardSize === MeetingCardSizes.large
          ? `-${section.sectionNum}`
          : (
            <Typography variant="subtitle2" component="span">
              &nbsp;
              {`${MeetingType[meetingType]}`}
            </Typography>
          )}
      </Typography>
      <Typography
        variant="subtitle2"
        style={{ display: cardSize === MeetingCardSizes.large ? 'block' : 'none' }}
      >
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
        (contentHeight, clientHeight): void => handleResize(contentHeight, clientHeight)
      }
      backgroundColor={bgColor}
      borderColor={bgColor}
    >
      {fullscreen ? fullscreenCard : normal}
    </ScheduleCard>
  );
};

export default MeetingCard;
