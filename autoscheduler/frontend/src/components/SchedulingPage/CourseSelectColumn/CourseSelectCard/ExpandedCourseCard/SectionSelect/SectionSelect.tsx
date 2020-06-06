import * as React from 'react';
import {
  List, ListItemText, ListItem, Checkbox, ListItemIcon, Typography, ListSubheader,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Meeting, { MeetingType } from '../../../../../../types/Meeting';
import { formatTime } from '../../../../../../timeUtil';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  const dispatch = useDispatch();

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  const toggleSelected = (i: number): void => {
    dispatch(updateCourseCard(id, {
      sections: sections.map((sec, idx) => (idx !== i ? sec : {
        section: sec.section,
        selected: !sec.selected,
        meetings: sec.meetings,
      })),
    }));
  };

  const formatMeetingDays = (meeting: Meeting): string => {
    const DAYS_OF_WEEK = ['M', 'T', 'W', 'R', 'F', 'S', 'U'];
    return meeting.meetingDays.reduce((acc, curr, idx) => (curr ? acc + DAYS_OF_WEEK[idx] : acc), '');
  };

  const getMeetingTimeText = (mtg: Meeting): string => {
    if (mtg.startTimeHours === 0) {
      // If the time is 00:00 but it's not honors, then showing nothing for the meeting time
      return mtg.section.web ? 'ONLINE' : '';
    }

    // Returns it in the format 12:00 - 1:00
    return `${formatTime(mtg.startTimeHours, mtg.startTimeMinutes)}
      - ${formatTime(mtg.endTimeHours, mtg.endTimeMinutes)}`;
  };

  /**
   * Accepts an array of meetings and returns a filtered array without duplicate meetings.
   * Meetings are considered to be duplicates if they are of the same type, meet on the same days,
   * and start and end at the same hour. Meetings that are the same by all of these criteria but
   * differ only in the exact minutes of the meeting will still be considered duplicates
   * @param arr
   */
  const filterDuplicateMeetings = (arr: Meeting[]): Meeting[] => {
    // add all meetings to a map, then get the values of the map
    const map = new Map<string, Meeting>();
    arr.forEach((mtg) => map.set(
      `${mtg.meetingType}${mtg.meetingDays}${mtg.startTimeHours}${mtg.endTimeHours}`, mtg,
    ));
    return [...map.values()];
  };

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <Typography className={styles.denseListItem} key={mtg.id}>
      <span className={styles.sectionNum} style={{ visibility: showSectionNum ? 'visible' : 'hidden' }}>
        {mtg.section.sectionNum}
      </span>
      <span className={styles.meetingDetailsText}>
        {MeetingType[mtg.meetingType]}
      </span>
      <span className={`${styles.meetingDetailsText} ${styles.meetingDays}`}>
        {formatMeetingDays(mtg)}
      </span>
      <span className={styles.meetingDetailsText}>
        {getMeetingTimeText(mtg)}
      </span>
    </Typography>
  );

  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    return sections.map(({ section, selected, meetings }, secIdx) => {
      const instructorLabel = lastProf !== section.instructor.name
        ? (
          <ListSubheader disableGutters className={styles.listSubheaderDense}>
            {section.instructor.name}
          </ListSubheader>
        )
        : null;
      lastProf = section.instructor.name;

      // get the meetings that match this section
      const sectionDetails = (
        <ListItem
          onClick={(): void => toggleSelected(secIdx)}
          dense
          disableGutters
          button
        >
          <ListItemIcon className={styles.myListItemIcon}>
            <Checkbox
              checked={selected}
              color="primary"
              size="small"
              className={styles.myIconButton}
            />
          </ListItemIcon>
          <ListItemText>
            {filterDuplicateMeetings(
              meetings.filter((mtg) => mtg.section.id === section.id),
            ).map((mtg, mtgIdx) => renderMeeting(mtg, mtgIdx === 0))}
          </ListItemText>
        </ListItem>
      );
      return (
        <React.Fragment key={section.sectionNum}>
          {instructorLabel}
          {sectionDetails}
        </React.Fragment>
      );
    });
  };

  return (
    <List disablePadding className={styles.sectionRows}>
      {makeList()}
    </List>
  );
};

export default SectionSelect;
