import * as React from 'react';
import ExpandedCourseCard from './ExpandedCourseCard/ExpandedCourseCard';
import CollapsedCourseCard from './CollapsedCourseCard/CollapsedCourseCard';

interface CourseSelectCardProps {
  onRemove: Function;
  id: number;
}

const CourseSelectCard: React.FC<CourseSelectCardProps> = ({ id, onRemove }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return collapsed ? (
    <CollapsedCourseCard
      onExpand={(): void => { setCollapsed(false); }}
      id={id}
    />
  ) : (
    <ExpandedCourseCard
      onCollapse={(): void => { setCollapsed(true); }}
      onRemove={(idx: number): void => { onRemove(idx); }}
      id={id}
    />
  );
};

export default CourseSelectCard;
