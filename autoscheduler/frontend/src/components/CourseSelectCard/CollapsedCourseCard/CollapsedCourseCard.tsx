import * as React from 'react';
import {
  Card, Typography, Box, IconButton,
} from '@material-ui/core';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import * as styles from './CollapsedCourseCard.css';
import { RootState } from '../../../redux/reducer';

interface CollapsedCourseCardProps {
    onExpand: Function;
    id: number;
}

const CollapsedCourseCard: React.FC<CollapsedCourseCardProps> = ({ onExpand, id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course);
  return (
    <Card classes={{ root: styles.maroonCard }}>
      <Box paddingLeft={1}>
        <Typography variant="subtitle1">{course || 'No course selected'}</Typography>
      </Box>
      <IconButton
        style={{ color: 'white' }}
        aria-label="Expand"
        onClick={(): void => onExpand()}
        size="small"
      >
        <ExpandIcon />
      </IconButton>
    </Card>
  );
};

export default CollapsedCourseCard;
