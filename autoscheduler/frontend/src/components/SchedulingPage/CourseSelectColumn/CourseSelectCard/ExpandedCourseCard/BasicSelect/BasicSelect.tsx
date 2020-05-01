import * as React from 'react';
import {
  Typography, FormLabel, Select, MenuItem,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';
import * as styles from './BasicSelect.css';
import { SectionSelected } from '../../../../../../types/CourseCardOptions';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const course = useSelector<RootState, string>((state) => state.courseCards[id].course || '');
  const web = useSelector<RootState, string>((state) => state.courseCards[id].web || 'exclude');
  const honors = useSelector<RootState, string>((state) => state.courseCards[id].honors || 'exclude');
  const sections = useSelector<RootState, SectionSelected[]>(
    (state) => state.courseCards[id].sections,
  );
  const dispatch = useDispatch();

  // shows placeholder text if no course is selected
  if (!course) {
    return (
      <Typography className={styles.grayText} variant="body1">
        Select a course to show available options
      </Typography>
    );
  }

  // determine whether or not there are honors or web sections
  const hasHonorsSections = sections.some((secData) => +secData.section.sectionNum < 300);
  const hasWebSections = sections.some((secData) => +secData.section.sectionNum >= 900);

  // show placeholder message if there are no special sections to filter
  if (!hasHonorsSections && !hasWebSections) {
    return (
      <Typography className={styles.grayText}>
        There are no honors or online courses for this class
      </Typography>
    );
  }

  return (
    <>
      <FormLabel>Options</FormLabel>
      <table className={styles.tableContainer}>
        <tbody>
          {hasHonorsSections
            ? (
              <tr>
                <td>
                  <Typography variant="body1" style={{ paddingRight: 8 }} id={`honors-${id}`}>Honors:</Typography>
                </td>
                <td>
                  <Select
                    variant="outlined"
                    value={honors}
                    classes={{ root: styles.selectRoot, selectMenu: styles.selectMenu }}
                    labelId={`honors-${id}`}
                    onChange={(evt): void => {
                      dispatch(updateCourseCard(id, { honors: evt.target.value as string }));
                    }}
                  >
                    <MenuItem value="no_preference">No Preference</MenuItem>
                    <MenuItem value="exclude">Exclude</MenuItem>
                    <MenuItem value="only">Only</MenuItem>
                  </Select>
                </td>
              </tr>
            ) : null}
          {hasWebSections
            ? (
              <tr>
                <td>
                  <Typography variant="body1" style={{ paddingRight: 8 }} id={`online-${id}`}>Online:</Typography>
                </td>
                <td>
                  <Select
                    variant="outlined"
                    value={web}
                    classes={{ root: styles.selectRoot, selectMenu: styles.selectMenu }}
                    labelId={`online-${id}`}
                    onChange={(evt): void => {
                      dispatch(updateCourseCard(id, { web: evt.target.value as string }));
                    }}
                  >
                    <MenuItem value="no_preference">No Preference</MenuItem>
                    <MenuItem value="exclude">Exclude</MenuItem>
                    <MenuItem value="only">Only</MenuItem>
                  </Select>
                </td>
              </tr>
            ) : null}
        </tbody>
      </table>
    </>
  );
};

export default BasicSelect;
