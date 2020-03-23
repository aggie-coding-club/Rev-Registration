import * as React from 'react';
import {
  List, ListItemText, ListItem, Checkbox, ListItemIcon, Typography, ListSubheader,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Meeting, { MeetingType } from '../../../../../types/Meeting';
import { formatTime } from '../../../../../timeUtil';
import { SectionSelected } from '../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import { updateCourseCard } from '../../../../../redux/actions/courseCards';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  const dispatch = useDispatch();

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
    const DAYS_OF_WEEK = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
    return meeting.meetingDays.reduce((acc, curr, idx) => (curr ? acc + DAYS_OF_WEEK[idx] : acc), '');
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
        {`${formatTime(mtg.startTimeHours, mtg.startTimeMinutes)}
        - ${formatTime(mtg.endTimeHours, mtg.endTimeMinutes)}`}
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
            {meetings.filter(
              (mtg) => mtg.section.id === section.id,
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
    <List disablePadding>
      {makeList()}
    </List>
  );
};

export default SectionSelect;
