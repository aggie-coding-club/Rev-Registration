import * as React from 'react';
import { List, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import SectionInfo from './SectionInfo';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  console.log(`rendering sectionselect ${id}`);
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );

  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  function makeList(startIdx: number): [JSX.Element, number] {
    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = startIdx;

    for (let secIdx = startIdx; secIdx < sections.length; secIdx++) {
      console.log('secIdx', secIdx);
      const sectionData = sections[secIdx];

      const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
      if (firstInProfGroup) currProfGroupStart = secIdx;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;

      const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

      // all sections in a group will be added at the same time
      if (lastInProfGroup) {
        const currProfGroupStartRef = currProfGroupStart;
        return [(
          <ul key={lastProf + lastHonors} className={styles.noStartPadding}>
            {sections.slice(currProfGroupStart, secIdx + 1).map((iterSecData, offset) => (
              <SectionInfo
                secIdx={currProfGroupStartRef + offset}
                courseCardId={id}
                sectionData={iterSecData}
                addInstructorLabel={offset === 0}
                isLastSection={currProfGroupStartRef + offset === secIdx}
                key={iterSecData.section.id}
              />
            ))}
          </ul>
        ), secIdx + 1];
      }
    }
  }

  const currIdx = React.useRef(0);
  const sectionList = React.useRef<JSX.Element[]>([]);
  const [view, setView] = React.useState([]);
  const getCurrentList = (): void => {
    (window as any).requestIdleCallback(getCurrentList);
    const [nextUL, nextIdx] = makeList(currIdx.current);
    console.log('nextIdx', nextIdx);
    currIdx.current = nextIdx;
    sectionList.current = [...sectionList.current, nextUL];
    setView(sectionList.current);
  };
  React.useEffect(getCurrentList, []);

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  console.log('sectionList', sectionList);
  return (
    <List disablePadding className={styles.sectionRows}>
      {view}
    </List>
  );
};

export default React.memo(SectionSelect);
