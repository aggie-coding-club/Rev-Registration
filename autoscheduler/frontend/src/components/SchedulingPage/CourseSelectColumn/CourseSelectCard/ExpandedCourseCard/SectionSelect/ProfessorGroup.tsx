import * as React from 'react';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import SectionInfo from './SectionInfo';
import * as styles from './SectionSelect.css';

interface ProfessorGroupProps {
    sections: SectionSelected[];
    courseCardId: number;
    currProfGroupStart: number;
}

const ProfessorGroup: React.FC<ProfessorGroupProps> = ({
  sections, courseCardId, currProfGroupStart,
}) => (
  <ul key={sections[0].section.instructor.name + sections[0].section.honors} className={styles.noStartPadding}>
    {sections.map((secData, offset) => (
      <SectionInfo
        secIdx={currProfGroupStart + offset}
        courseCardId={courseCardId}
        sectionData={secData}
        addInstructorLabel={offset === 0}
        isLastSection={offset === sections.length - 1}
        key={secData.section.id}
      />
    ))}
  </ul>
);

export default ProfessorGroup;
