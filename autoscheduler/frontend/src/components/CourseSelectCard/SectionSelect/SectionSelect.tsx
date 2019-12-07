import * as React from 'react';
import {
  List, ListItemText, ListItem, Checkbox, ListItemIcon,
} from '@material-ui/core';
import Instructor from '../../../types/Instructor';
import Section from '../../../types/Section';

interface SectionSelected {
  section: Section;
  selected: boolean;
}

const testSections = [
  new Section({
    id: 123456,
    subject: 'SUBJ',
    courseNum: 234,
    sectionNum: 500,
    minCredits: 3,
    maxCredits: null,
    currentEnrollment: 56,
    instructor: new Instructor({
      id: 123456,
      name: 'Aakash Tyagi',
    }),
  }),
  new Section({
    id: 123457,
    subject: 'SUBJ',
    courseNum: 234,
    sectionNum: 501,
    minCredits: 3,
    maxCredits: null,
    currentEnrollment: 56,
    instructor: new Instructor({
      id: 123456,
      name: 'Aakash Tyagi',
    }),
  }),
  new Section({
    id: 123458,
    subject: 'SUBJ',
    courseNum: 234,
    sectionNum: 502,
    minCredits: 3,
    maxCredits: null,
    currentEnrollment: 56,
    instructor: new Instructor({
      id: 1975,
      name: 'Somebody Else',
    }),
  }),
];

const SectionSelect = (): JSX.Element => {
  const [sections, setSections] = React.useState<SectionSelected[]>(
    testSections.map((sec) => ({ section: sec, selected: false })),
  );

  const toggleSelected = (i: number): void => {
    const newSections = Array.from(sections);
    sections[i].selected = !sections[i].selected;
    setSections(newSections);
  };

  const makeList = (): JSX.Element[] => {
    let lastProfId: number = null;
    return sections.map(({ section, selected }, idx) => {
      const instructorLabel = lastProfId !== section.instructor.id
        ? (
          <ListItem key={section.instructor.id} dense>
            <ListItemText>{section.instructor.name}</ListItemText>
          </ListItem>
        )
        : null;
      lastProfId = section.instructor.id;

      const sectionDetails = (
        <ListItem key={section.sectionNum} onClick={(): void => toggleSelected(idx)} dense>
          <ListItemIcon>
            <Checkbox
              checked={selected}
              color="primary"
            />
          </ListItemIcon>
          <ListItemText>{section.sectionNum}</ListItemText>
        </ListItem>
      );
      return instructorLabel
        ? (
          <>
            {instructorLabel}
            {sectionDetails}
          </>
        )
        : sectionDetails;
    });
  };

  return (
    <List>
      {makeList()}
    </List>
  );
};

export default SectionSelect;
