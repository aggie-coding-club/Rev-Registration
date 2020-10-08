import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExpandedCourseCard from './ExpandedCourseCard/ExpandedCourseCard';
import CollapsedCourseCard from './CollapsedCourseCard/CollapsedCourseCard';
import { RootState } from '../../../../redux/reducer';
import { updateCourseCard } from '../../../../redux/actions/courseCards';

interface CourseSelectCardProps {
  id: number;
}

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({ id }) => {
  const collapsed = useSelector<RootState, boolean>((state) => state.courseCards[id].collapsed);
  const dispatch = useDispatch();

  const toggleCollapsed = (): void => {
    dispatch(updateCourseCard(id, { collapsed: !collapsed }));
  };

  return collapsed ? (
    <CollapsedCourseCard
      onExpand={toggleCollapsed}
      id={id}
    />
  ) : (
    <ExpandedCourseCard
      onCollapse={toggleCollapsed}
      id={id}
    />
  );
};

export default CourseSelectCard;
