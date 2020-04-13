import * as React from 'react';
import {
  Card, Typography, Box, IconButton,
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Delete';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './CollapsedCourseCard.css';
import { RootState } from '../../../../redux/reducer';
import { removeCourseCard } from '../../../../redux/actions/courseCards';

interface CollapsedCourseCardProps {
    onExpand: Function;
    id: number;
}

const CollapsedCourseCard: React.FC<CollapsedCourseCardProps> = ({ onExpand, id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course);
  const dispatch = useDispatch();
  return (
    <Card
      classes={{ root: styles.maroonCard }}
      aria-label="Expand"
      onClick={(): void => onExpand()}
    >
      <Box display="flex" flexDirection="row">
        <IconButton
          style={{ color: 'white' }}
          size="small"
          onClick={(evt): void => {
            dispatch(removeCourseCard(id));
            evt.stopPropagation();
          }}
        >
          <RemoveIcon />
        </IconButton>
        <Typography variant="subtitle1">{course || 'No course selected'}</Typography>
      </Box>
      <IconButton style={{ color: 'white' }} size="small">
        <ExpandIcon />
      </IconButton>
    </Card>
  );
};

export default CollapsedCourseCard;
