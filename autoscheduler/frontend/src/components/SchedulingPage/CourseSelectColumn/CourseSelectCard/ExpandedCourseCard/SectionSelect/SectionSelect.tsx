import * as React from 'react';
import { List, Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { SectionSelected, SortType } from '../../../../../../types/CourseCardOptions';
import { updateSortType } from '../../../../../../redux/actions/courseCards';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import SectionInfo from './SectionInfo';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  // section select refuses to update on sort
  const sortType = useSelector<RootState, SortType>(
    (state) => state.courseCards[id].sortType,
  );

  // for change sort type
  const dispatch = useDispatch();

  // show placeholder text if there are no sections
  if (sections.length === 0) {
    return (
      <Typography className={styles.grayText} variant="body1">
        There are no available sections for this term
      </Typography>
    );
  }

  /**
   * Makes a list of `SectionInfo` elements, one for each section of this course, by iterating over
   * each section in `sections`. As it iterates, this function groups consecutive sections with the
   * same professor and honors status together inside one `<ul>` and under one header. Having them
   * all inside the same `<ul>` is important in order to get smooth transitions with sticky headers.
   */
  const makeList = (): JSX.Element[] => {
    let lastProf: string = null;
    let lastHonors = false;
    let currProfGroupStart = 0;
    return sections.map((sectionData, secIdx) => {
      const firstInProfGroup = lastProf !== sectionData.section.instructor.name
        || lastHonors !== sectionData.section.honors;
      if (firstInProfGroup) currProfGroupStart = secIdx;

      lastProf = sectionData.section.instructor.name;
      lastHonors = sectionData.section.honors;

      const lastInProfGroup = lastProf !== sections[secIdx + 1]?.section.instructor.name
        || lastHonors !== sections[secIdx + 1]?.section.honors;

      // all sections in a group will be added at the same time
      if (!lastInProfGroup) return null;

      return (
        <ul key={`${lastProf + lastHonors} ${secIdx}`} className={styles.noStartPadding}>
          {sections.slice(currProfGroupStart, secIdx + 1).map((iterSecData, offset) => (
            <SectionInfo
              secIdx={currProfGroupStart + offset}
              courseCardId={id}
              sectionData={iterSecData}
              addInstructorLabel={offset === 0}
              isLastSection={currProfGroupStart + offset === secIdx}
              key={iterSecData.section.id}
            />
          ))}
        </ul>
      );
    });
  };

  const sectionSelectOptions = (
    <div>
      <Button onClick={(): void => { dispatch(updateSortType(id, SortType.DEFAULT)); }} type="button">Default</Button>
      <Button onClick={(): void => { dispatch(updateSortType(id, SortType.SECTION_NUM)); }} type="button">Section Num</Button>
      <Button onClick={(): void => { dispatch(updateSortType(id, SortType.GRADE)); }} type="button">Grade</Button>
      <Button onClick={(): void => { dispatch(updateSortType(id, SortType.INSTRUCTOR)); }} type="button">Instructor</Button>
      <Button onClick={(): void => { dispatch(updateSortType(id, SortType.OPEN_SEATS)); }} type="button">Open Seats</Button>
    </div>
  );

  return (
    <>
      {sectionSelectOptions}
      <List disablePadding className={styles.sectionRows}>
        {makeList()}
      </List>
    </>
  );
};

export default SectionSelect;
