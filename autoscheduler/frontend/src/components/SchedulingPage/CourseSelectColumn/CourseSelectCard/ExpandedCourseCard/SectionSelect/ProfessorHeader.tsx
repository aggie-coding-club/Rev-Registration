import * as React from 'react';
import { ListSubheader, Tooltip, Divider } from '@material-ui/core';
import HonorsIcon from '@material-ui/icons/School';
import Section from '../../../../../../types/Section';
import GradeDist from './GradeDist/GradeDist';
import * as styles from './SectionSelect.css';

interface ProfessorHeaderProps {
    section: Section;
}

const ProfessorHeader: React.FC<ProfessorHeaderProps> = ({ section }) => (
  <>
    <ListSubheader disableGutters className={`${styles.listSubheaderDense} ${styles.professorHeader}`}>
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
    <div className={`${styles.dividerContainer} ${styles.professorHeader}`}>
      <Divider />
    </div>
  </>
);

export default ProfessorHeader;
