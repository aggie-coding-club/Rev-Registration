import * as React from 'react';
import { Typography } from '@material-ui/core';
import * as styles from './MeetingCard.css';
import Meeting, { MeetingType } from '../../../../types/Meeting';
import ScheduleCard from '../ScheduleCard/ScheduleCard';

interface MeetingCardProps {
  meeting: Meeting;
  bgColor: string;
  firstHour: number;
  lastHour: number;
}

/**
 * Renders a meeting of a class on the schedule
 * @param props include meeting, bgColor, firstHour, and lastHour
 */
const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting, bgColor, firstHour, lastHour,
}: MeetingCardProps) => {
  // destructure meeting for ease of access
  const {
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, section, meetingType,
  } = meeting;
  const [isBig, setIsBig] = React.useState(true);

  // Only render text after first component render to prevent text from flashing due to resizing
  const text = React.useRef<HTMLElement>();
  const [shouldRenderText, setShouldRenderText] = React.useState(false);
  React.useEffect(() => {
    setShouldRenderText(Boolean(text.current));
  }, [text]);

  // hide meeting type if the card is small
  const handleResize = React.useCallback((newVal: boolean): void => {
    setIsBig(newVal);
  }, []);

  const textStyle: React.CSSProperties = shouldRenderText ? {} : { visibility: 'hidden' };

  return (
    <ScheduleCard
      startTimeHours={startTimeHours}
      startTimeMinutes={startTimeMinutes}
      endTimeHours={endTimeHours}
      endTimeMinutes={endTimeMinutes}
      firstHour={firstHour}
      lastHour={lastHour}
      onResizeWindow={
        (contentHeight, clientHeight): void => handleResize(contentHeight < clientHeight)
      }
      backgroundColor={bgColor}
      borderColor={bgColor}
    >
      <Typography style={textStyle} variant="body2" data-testid="meeting-card-primary-content" className={styles.meetingCardText} ref={text}>
        {`${section.subject} ${section.courseNum}`}
        {isBig
          ? `-${section.sectionNum}`
          : (
            <Typography variant="subtitle2" component="span">
              &nbsp;
              {`${MeetingType[meetingType]}`}
            </Typography>
          )}
        {isBig
          ? (
            <Typography variant="subtitle2" style={{ display: isBig ? 'block' : 'none' }}>
              {MeetingType[meetingType]}
            </Typography>
          )
          : null}
      </Typography>
    </ScheduleCard>
  );
};

export default MeetingCard;
