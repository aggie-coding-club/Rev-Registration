import * as React from 'react';
import { Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeList } from 'react-window';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import { RootState } from '../../../../../../redux/reducer';
import * as styles from './SectionSelect.css';
import VirtualizedRow, { RowData } from './VirtualizedRow';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';

interface SectionSelectProps {
  id: number;
}

const SectionSelect: React.FC<SectionSelectProps> = ({ id }): JSX.Element => {
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  const initHeights = sections.reduce<Map<number, number>>((map, sec) => {
    map.set(sec.section.id, 8 + 24 * (sec.meetings.length + 1));
    return map;
  }, new Map());
  const [heights, setHeights] = React.useState(initHeights);
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

  const setHeight = (secId: number, height: number): void => {
    const newMap = new Map(heights);
    newMap.set(secId, height);
    setHeights(newMap);
  };

  const itemData: RowData[] = [];
  let lastProf: string = null;
  let lastHonors = false;
  sections.forEach((sectionData) => {
    const makeNewGroup = lastProf !== sectionData.section.instructor.name
      || lastHonors !== sectionData.section.honors;
    if (makeNewGroup) {
      itemData.push({
        rowType: 'header',
        sectionData,
      });
      itemData.push({
        rowType: 'divider',
        sectionData,
      });
    }
    lastProf = sectionData.section.instructor.name;
    lastHonors = sectionData.section.honors;

    itemData.push({
      rowType: 'section',
      sectionData,
      setHeight,
      toggleSelected,
    });
  });


  const getItemHeight = (idx: number): number => {
    switch (itemData[idx].rowType) {
      case 'header': return 24;
      case 'divider': return 5; // 1px height + 4px margin-top
      case 'section':
      default: return heights.get(itemData[idx].sectionData.section.id);
    }
  };

  const contentHeight = itemData.reduce((acc, _, idx) => acc + getItemHeight(idx), 0);
  const maxListHeight = 400;
  if (contentHeight < maxListHeight) {
    return (
      <div>
        {itemData.map((_, idx) => (
          <VirtualizedRow
            data={itemData}
            index={idx}
            style={null}
            key={`${itemData[idx].sectionData.section.id}${idx % 3}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ height: maxListHeight }}>
      <AutoSizer>
        {
     ({ height, width }): JSX.Element => (
       <VariableSizeList
         height={height}
         width={width}
         itemSize={getItemHeight}
         itemCount={itemData.length}
         itemData={itemData}
       >
         {VirtualizedRow}
       </VariableSizeList>
     )
    }
      </AutoSizer>
    </div>
  );
};

export default SectionSelect;
