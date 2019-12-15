import * as React from 'react';
import {
  List, ListItemText, ListItem, Checkbox, ListItemIcon, Typography,
} from '@material-ui/core';
import Section from '../../../types/Section';
import * as styles from './SectionSelect.css';
import Meeting, { MeetingType } from '../../../types/Meeting';

interface SectionSelected {
  section: Section;
  selected: boolean;
}

interface SectionSelectProps {
  meetings: Meeting[];
}

const SectionSelect: React.FC<SectionSelectProps> = ({ meetings }): JSX.Element => {
  // compute initial value of state from props
  const distinct = (
    sectionData: SectionSelected, idx: number, arr: Array<SectionSelected>,
  ): boolean => arr.findIndex(
    (other) => sectionData.section.sectionNum === other.section.sectionNum,
  ) === idx;
  const initSections = meetings.map((mtg) => ({
    section: mtg.section,
    selected: false,
  })).filter(distinct);

  const [sections, setSections] = React.useState(initSections);

  // update state if props change
  React.useEffect(() => setSections(
    meetings.map((mtg) => ({
      section: mtg.section,
      selected: false,
    })).filter(distinct),
  ), [meetings]);

  const toggleSelected = (i: number): void => {
    const newSections = Array.from(sections);
    sections[i].selected = !sections[i].selected;
    setSections(newSections);
  };

  const formatHours = (hours: number): number => ((hours - 1) % 12) + 1;

  const renderMeeting = (mtg: Meeting, showSectionNum: boolean): JSX.Element => (
    <Typography>
      <span className={styles.meetingDetailsText} style={{ visibility: showSectionNum ? 'visible' : 'hidden' }}>
        {mtg.section.sectionNum}
      </span>
      <span className={styles.meetingDetailsText}>
        {MeetingType[mtg.meetingType]}
      </span>
      <span className={styles.meetingDetailsText}>
        {mtg.building}
      </span>
      <span className={styles.meetingDetailsText}>
        {`${formatHours(mtg.startTimeHours)}:${
          new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(mtg.startTimeMinutes)
        } - ${formatHours(mtg.endTimeHours)}:${
          new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(mtg.endTimeMinutes)}`}
      </span>
    </Typography>
  );

  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    return sections.map(({ section, selected }, secIdx) => {
      const instructorLabel = lastProf !== section.instructor.name
        ? (
          <ListItem key={section.instructor.name} dense disableGutters>
            <ListItemText>{section.instructor.name}</ListItemText>
          </ListItem>
        )
        : null;
      lastProf = section.instructor.name;

      // get the meetings that match this section
      const sectionDetails = (
        <ListItem
          key={section.sectionNum}
          onClick={(): void => toggleSelected(secIdx)}
          dense
          disableGutters
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
        <>
          {instructorLabel}
          {sectionDetails}
        </>
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
