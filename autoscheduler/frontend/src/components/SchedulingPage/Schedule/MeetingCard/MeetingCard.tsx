import * as React from 'react';
import { Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import * as styles from './MeetingCard.css';
import * as sectionSelectStyles from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionSelect.css';
import Meeting, { MeetingType } from '../../../../types/Meeting';
import ScheduleCard from '../ScheduleCard/ScheduleCard';
import meetingTimeText from '../../../../utils/meetingTimeText';
import { meetingBuildingWithRoom } from '../../../../utils/meetingBuilding';
import { generateSectionInfoID } from '../../CourseSelectColumn/CourseSelectCard/ExpandedCourseCard/SectionSelect/SectionInfo';
import { expandCourseCard } from '../../../../redux/actions/courseCards';
import GenericSnackbar from '../../../GenericSnackbar';

enum MeetingCardSize {
  SMALL, // 1 line, for <50 minute meetings
  MEDIUM, // 2 lines
  LARGE // 3 lines
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
 * @param props include meeting, bgColor, firstHour, lastHour and fullscreen.
 * The fullscreen prop shifts this into a separate mode that displays a larger amount of information
 * for being displayed for the fullscreen view as well as saving an image as a schedule.
 */
const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting, bgColor, firstHour, lastHour, fullscreen = false,
}: MeetingCardProps) => {
  // destructure meeting for ease of access
  const {
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, section, meetingType,
  } = meeting;
  const [cardSize, setCardSize] = React.useState(MeetingCardSize.LARGE);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const dispatch = useDispatch();

  // Only render text after first component render to prevent text from flashing due to resizing
  const text = React.useRef<HTMLDivElement>();
  const [shouldRenderText, setShouldRenderText] = React.useState(false);
  React.useEffect(() => {
    setShouldRenderText(Boolean(text.current));
  }, [text]);

  // hide meeting type if the card is small
  const handleResize = React.useCallback((contentHeight: number, clientHeight: number): void => {
    const heightDiff = clientHeight - contentHeight;
    if (heightDiff > 30) {
      setCardSize(MeetingCardSize.LARGE);
    } else if (heightDiff > -15) { // Just enough for two rows of text
      setCardSize(MeetingCardSize.MEDIUM);
    } else {
      setCardSize(MeetingCardSize.SMALL);
    }
  }, []);

  // Determine which size of fullscreen card to use
  let cardContent: JSX.Element;
  if (fullscreen) {
    switch (cardSize) {
      case MeetingCardSize.LARGE:
        cardContent = (
          <>
            <Typography variant="body2" className={styles.meetingCardText}>
              {`${section.subject} ${section.courseNum}`}
              {`-${section.sectionNum}`}
              &nbsp;
              &bull;
              &nbsp;
              <Typography variant="body2" component="span">
                {`${MeetingType[meetingType]}`}
              </Typography>
            </Typography>
            <Typography variant="body2" className={styles.meetingCardText}>
              {meetingTimeText(meeting)}
            </Typography>
            <Typography variant="subtitle2">
              {meetingBuildingWithRoom(meeting)}
            </Typography>
            <Typography variant="body2" className={styles.meetingCardText}>
              {meeting.section.instructor.name}
            </Typography>
          </>
        );
        break;
      case MeetingCardSize.MEDIUM:
        cardContent = (
          <>
            <Typography variant="body2" className={styles.meetingCardText}>
              {`${section.subject} ${section.courseNum}`}
              {`-${section.sectionNum}`}
              &nbsp;
              &bull;
              &nbsp;
              <Typography variant="body2" component="span">
                {`${MeetingType[meetingType]}`}
              </Typography>
              &nbsp;
              &bull;
              &nbsp;
              <Typography variant="body2" component="span">
                {meetingTimeText(meeting)}
              </Typography>
            </Typography>
            <Typography variant="body2" className={styles.meetingCardText}>
              <Typography variant="subtitle2" component="span">
                {meetingBuildingWithRoom(meeting)}
              </Typography>
              &nbsp;
              &bull;
              &nbsp;
              {meeting.section.instructor.name}
            </Typography>
          </>
        );
        break;
      case MeetingCardSize.SMALL:
        cardContent = (
          <>
            <Typography variant="body2" className={styles.meetingCardText}>
              {`${section.subject} ${section.courseNum}`}
              {`-${section.sectionNum}`}
              &nbsp;
              &bull;
              &nbsp;
              <Typography variant="body2" component="span">
                {meetingBuildingWithRoom(meeting)}
              </Typography>
              &nbsp;
              &bull;
              &nbsp;
              <Typography variant="body2" component="span">
                {meetingTimeText(meeting)}
              </Typography>
            </Typography>
          </>
        );
        break;
      default:
        break;
    }
  } else { // default meeting card
    cardContent = (
      <>
        <Typography
          variant="body2"
          data-testid="meeting-card-primary-content"
          className={styles.meetingCardText}
        >
          {`${section.subject} ${section.courseNum}`}
          {cardSize === MeetingCardSize.LARGE
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
          style={{ display: cardSize === MeetingCardSize.LARGE ? 'block' : 'none' }}
        >
          {MeetingType[meetingType]}
        </Typography>
      </>
    );
  }

  const handleClick = (): void => {
    function executeScroll(): void {
      const id = generateSectionInfoID(meeting.section);

      document.getElementById(id).scrollIntoView({
        block: 'center', inline: 'nearest', behavior: 'smooth',
      });

      document.getElementById(id).classList.add(sectionSelectStyles.highlightCard);

      // Remove the classname after the highlight transition displays
      setTimeout(() => {
        document.getElementById(id).classList.remove(sectionSelectStyles.highlightCard);
      }, 1000);
    }

    try {
      dispatch(expandCourseCard(meeting.section));
    } catch (error) {
      setSnackbarMessage(error.message);
      return;
    }

    setTimeout(() => {
      executeScroll();
    }, 10);
  };

  const textStyle: React.CSSProperties = shouldRenderText ? {} : { visibility: 'hidden' };

  return (
    <>
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
        onClick={handleClick}
      >
        <div style={textStyle} ref={text} className={styles.textWrapper}>
          {cardContent}
        </div>
      </ScheduleCard>
      <GenericSnackbar snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage} />
    </>
  );
};

export default MeetingCard;
