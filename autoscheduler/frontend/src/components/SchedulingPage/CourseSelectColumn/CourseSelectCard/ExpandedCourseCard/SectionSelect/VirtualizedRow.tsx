import {
  Divider, ListSubheader, Tooltip,
} from '@material-ui/core';
import HonorsIcon from '@material-ui/icons/School';
import * as React from 'react';
import { ListChildComponentProps } from 'react-window';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';
import GradeDist from './GradeDist/GradeDist';
import SectionInfo from './SectionInfo';
import * as styles from './SectionSelect.css';

export interface RowData {
  rowType: 'header' | 'section' | 'divider';
  sectionData: SectionSelected;
  toggleSelected?: (secId: number) => void;
  setHeight?: (secId: number, height: number) => void;
}

interface VirtualizedRowProps extends ListChildComponentProps {
  data: RowData[];
}

const VirtualizedRow: React.FC<VirtualizedRowProps> = ({ data, index, style }) => {
  const { section } = data[index].sectionData;

  switch (data[index].rowType) {
    case 'header':
      // returns a div containing the section's number and available/max enrollmen
      // show section number and remaining seats if this is the first meeting for a section
      return (
        <ListSubheader disableGutters className={styles.listSubheaderDense} style={style}>
          <div className={styles.nameHonorsIcon}>
            {section.instructor.name}
            {section.honors ? (
              <Tooltip title="Honors" placement="right">
                <HonorsIcon data-testid="honors" />
              </Tooltip>
            ) : null}
          </div>
          {section.grades
            ? <GradeDist grades={section.grades} />
            : (
              <div className={styles.noGradesAvailable}>
                    No grades available
              </div>
            )}
        </ListSubheader>
      );
    case 'divider':
      return (
        <div className={styles.dividerContainer} style={style}>
          <Divider />
        </div>
      );
    case 'section':
      if (!data[index].toggleSelected) throw Error('toggleSelected is required for SectionInfo');
      return (
        <SectionInfo
          sectionData={data[index].sectionData}
          toggleSelected={data[index].toggleSelected}
          setHeight={data[index].setHeight}
          style={style}
        />
      );
    default:
      throw Error('wtf');
  }
};

export default VirtualizedRow;
