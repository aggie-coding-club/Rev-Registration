import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import * as styles from './CourseSelectColumn.css';
import { RootState } from '../../redux/reducers';
import { CourseCardArray, CustomizationLevel } from '../../types/CourseCardOptions';
import CourseSelectCard from '../CourseSelectCard/CourseSelectCard';
import { addCourseCard } from '../../redux/actions';
const CourseSelectColumn: React.FC<RouteComponentProps> = () => {
  const thing = 5;

  const courseCards = useSelector<RootState, CourseCardArray>(
    (state) => state.courseCards,
  );

  const dispatch = useDispatch();

  const rows: JSX.Element[] = [];

  for (let i = 0; i < courseCards.numCardsCreated; i++) {
    if (courseCards[i]) {
      rows.push(<CourseSelectCard key={`${i} stuff`} id={i} />);
    }
  }

  return (
    <div className={styles.container}>
      <div>
        {rows}
      </div>
      <Button
        onClick={(): void => {
          dispatch(addCourseCard({ customizationLevel: CustomizationLevel.BASIC, sections: [] }));
        }}
      >
        Add Courses
      </Button>
    </div>
  );
};

export default CourseSelectColumn;
