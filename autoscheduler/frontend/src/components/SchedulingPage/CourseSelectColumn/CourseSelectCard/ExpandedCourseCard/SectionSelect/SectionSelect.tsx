import * as React from 'react';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { GroupedVirtuoso } from 'react-virtuoso';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import ProfessorHeader from './ProfessorHeader';
import SectionInfo from './SectionInfo';
import Section from '../../../../../../types/Section';

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

  const toggleSelected = (secId: number): void => {
    dispatch(updateCourseCard(id, {
      sections: sections.map((sec) => (secId !== sec.section.id ? sec : {
        section: sec.section,
        selected: !sec.selected,
        meetings: sec.meetings,
      })),
    }));
  };

  let lastProf: string = null;
  let lastHonors = false;
  const groupCounts: number[] = [];
  const firstSections: Section[] = [];
  sections.forEach((sectionData) => {
    const makeNewGroup = lastProf !== sectionData.section.instructor.name
      || lastHonors !== sectionData.section.honors;
    if (makeNewGroup) {
      groupCounts.push(0);
      firstSections.push(sectionData.section);
    }
    lastProf = sectionData.section.instructor.name;
    lastHonors = sectionData.section.honors;

    groupCounts[groupCounts.length - 1] += 1;
  });

  const getItemHeight = (idx: number): number => sections[idx].meetings.length * 24 + 8 + 24 + 5;

  const contentHeight = sections.reduce((acc, _, idx) => acc + getItemHeight(idx), 0);
  const maxListHeight = 400;
  const height = Math.min(contentHeight, maxListHeight);

  return (
    <div style={{ height }}>
      <AutoSizer>
        {
     ({ width }): JSX.Element => (
       <GroupedVirtuoso
         style={{ height, width }}
         overscan={maxListHeight}
         groupCounts={groupCounts}
         group={(idx): JSX.Element => <ProfessorHeader section={firstSections[idx]} />}
         item={(idx): JSX.Element => (
           <SectionInfo
             sectionData={sections[idx]}
             toggleSelected={toggleSelected}
           />
         )}
       />
     )
    }
      </AutoSizer>
    </div>
  );
};

export default SectionSelect;
