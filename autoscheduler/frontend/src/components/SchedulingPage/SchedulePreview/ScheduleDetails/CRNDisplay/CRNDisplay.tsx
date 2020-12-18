import { IconButton, Tooltip } from '@material-ui/core';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import * as React from 'react';
import * as styles from '../ScheduleDetails.css';

interface CRNDisplayProps {
  crn: number;
}

const initialTooltipText = 'Copy CRN';
const copiedTooltipText = 'CRN copied to clipboard!';

const CRNDisplay: React.FC<CRNDisplayProps> = ({ crn }) => {
  const [tooltipText, setTooltipText] = React.useState(initialTooltipText);

  const copyCRN = (): void => {
    navigator.clipboard.writeText(String(crn)).then(() => {
      setTooltipText(copiedTooltipText);
    });
  };

  const resetTooltip = (): void => setTooltipText(initialTooltipText);

  return (
    <div className={styles.crnContainer}>
      {`CRN: ${crn}`}
      <Tooltip title={tooltipText}>
        <IconButton size="small" onClick={copyCRN} onMouseEnter={resetTooltip}>
          <FileCopyOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default CRNDisplay;
