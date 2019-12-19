import * as React from 'react';
import {
  Card, Typography, Box, IconButton,
} from '@material-ui/core';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { useSelector } from 'react-redux';
import * as styles from './CollapsedCourseCard.css';
import { RootState } from '../../../redux/reducers';

interface CollapsedCourseCardProps {
    onExpand: Function;
    id: number;
}

const CollapsedCourseCard: React.FC<CollapsedCourseCardProps> = ({ onExpand, id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course);
  return (
    <Card classes={{ root: styles.maroonCard }}>
      <Box padding={1}>
        <Typography variant="subtitle1">{course || 'No course selected'}</Typography>
      </Box>
      <IconButton
        style={{ color: 'white ' }}
        aria-label="Expand"
        onClick={(): void => onExpand()}
      >
        <ExpandIcon />
      </IconButton>
    </Card>
  );
};

export default CollapsedCourseCard;
