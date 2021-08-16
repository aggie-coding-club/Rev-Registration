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
  small, // 1 line, for <50 minute meetings
  medium, // 2 lines
  large // 3 lines
}

interface MeetingCardProps {
  meeting: Meeting;
  bgColor: string;
  firstHour: number;
  lastHour: number;
  // If we're in fullscreen (or screenshotting), render the fullscreen cards
  fullscreen?: boolean;
  // If we're screenshotting, then increase the font size
  screenshot?: boolean;
}

/**
 * Renders a meeting of a class on the schedule
 * @param props include meeting, bgColor, firstHour, and lastHour
 */
const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting, bgColor, firstHour, lastHour, fullscreen = false, screenshot = false,
}: MeetingCardProps) => {
  // destructure meeting for ease of access
  const {
    startTimeHours, startTimeMinutes, endTimeHours, endTimeMinutes, section, meetingType,
  } = meeting;
  const [cardSize, setCardSize] = React.useState(MeetingCardSize.large);
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
    if (heightDiff > 45) {
      setCardSize(MeetingCardSize.large);
    } else if (heightDiff > -15) { // Just enough for two rows of text
      setCardSize(MeetingCardSize.medium);
    } else {
      setCardSize(MeetingCardSize.small);
    }
  }, []);

  const displayNone = { display: 'none' };
  const largeText = (screenshot
                        ? `${styles.meetingCardText} ${styles.screenshotLargeText}`
                        : `${styles.meetingCardText}`);

    // Determine which size of fullscreen card to use
  let cardContent = null;
  if (fullscreen || screenshot) {
    switch (cardSize) {
      case MeetingCardSize.large:
        cardContent = (
          <>
            <Typography variant="body2" className={largeText}>
              {`${section.subject} ${section.courseNum}`}
              {`-${section.sectionNum}`}
              &nbsp;
              &bull;
              &nbsp;
              <Typography variant="body2" component="span" className={largeText}>
                {`${MeetingType[meetingType]}`}
              </Typography>
            </Typography>
            <Typography variant="body2" className={largeText}>
              {meetingTimeText(meeting)}
            </Typography>
            <Typography variant="subtitle2" className={largeText}>
              {meetingBuildingWithRoom(meeting)}
            </Typography>
            <Typography variant="body2" className={largeText}>
              {meeting.section.instructor.name}
            </Typography>
          </>
        );
        break;
      case MeetingCardSize.medium:
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
      case MeetingCardSize.small:
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
  } else { // default fullscreen card
    cardContent = (
      <>
        <Typography
          variant="body2"
          data-testid="meeting-card-primary-content"
          className={styles.meetingCardText}
        >
          {`${section.subject} ${section.courseNum}`}
          {cardSize === MeetingCardSize.large
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
          style={{ display: cardSize === MeetingCardSize.large ? 'block' : 'none' }}
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
