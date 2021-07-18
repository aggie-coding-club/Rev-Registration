import * as React from 'react';
import { Tooltip, Typography } from '@material-ui/core';
import {
  Flight, Language, Laptop, Museum, People, Search, Work,
} from '@material-ui/icons';
import Section, { InstructionalMethod } from '../../../../../../../types/Section';
import * as styles from './SectionAttributeIcons.css';

interface SectionAttributeIconsProps {
  section: Section;
}

const instructionalMethodIcons: Record<InstructionalMethod, JSX.Element> = {
  [InstructionalMethod.F2F]: <People color="action" fontSize="small" />,
  [InstructionalMethod.INTERNSHIP]: <Work color="action" fontSize="small" />,
  [InstructionalMethod.NONTRADITIONAL]: <Search color="action" fontSize="small" />,
  [InstructionalMethod.WEB_BASED]: <Language color="action" fontSize="small" />,
  [InstructionalMethod.STUDY_ABROAD]: <Flight color="action" fontSize="small" />,
  [InstructionalMethod.NONE]: null,
  [InstructionalMethod.REMOTE]: <Laptop color="action" fontSize="small" />,
  [InstructionalMethod.F2F_REMOTE_OPTION]: (
    <>
      <People color="action" fontSize="small" />
      <Typography color="textSecondary">&nbsp;/&nbsp;</Typography>
      <Laptop color="action" fontSize="small" />
    </>
  ),
  [InstructionalMethod.MIXED_F2F_REMOTE]: (
    <>
      <People color="action" fontSize="small" />
      <Typography color="textSecondary">&nbsp;+&nbsp;</Typography>
      <Laptop color="action" fontSize="small" />
    </>
  ),
};

const SectionAttributeIcons: React.FC<SectionAttributeIconsProps> = ({
  section,
}) => {
  const { instructionalMethod, mcallen } = section;

  const instructionalMethodIcon = (
    <Tooltip title={instructionalMethod} placement="top" arrow>
      <span className={styles.iconGroupContainer}>
        {instructionalMethodIcons[instructionalMethod]}
      </span>
    </Tooltip>
  );

  const mcallenIcon = mcallen ? (
    <Tooltip title="McAllen" placement="top" arrow>
      <Museum color="action" fontSize="small" />
    </Tooltip>
  ) : null;

  return (
    <div className={styles.iconGroupContainer}>
      {instructionalMethodIcon}
      {mcallenIcon}
    </div>
  );
};

export default SectionAttributeIcons;
