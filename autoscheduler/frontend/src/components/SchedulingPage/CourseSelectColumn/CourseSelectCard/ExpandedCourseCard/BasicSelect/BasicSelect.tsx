import * as React from 'react';
import {
  Checkbox, List, ListItem, ListItemIcon, ListItemText, FormLabel,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../../redux/reducer';
import { updateCourseCard } from '../../../../../../redux/actions/courseCards';

interface BasicSelectProps {
  id: number;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ id }) => {
  const web = useSelector<RootState, boolean>((state) => state.courseCards[id].web || false);
  const honors = useSelector<RootState, boolean>((state) => state.courseCards[id].honors || false);
  const dispatch = useDispatch();

  return (
    <>
      <FormLabel>Options</FormLabel>
      <List>
        <ListItem
          dense
          disableGutters
          button
          onClick={
            (): void => { dispatch(updateCourseCard(id, { honors: !honors })); }
          }
        >
          <ListItemIcon>
            <Checkbox
              color="primary"
              checked={honors}
            />
          </ListItemIcon>
          <ListItemText>Honors Only</ListItemText>
        </ListItem>
        <ListItem
          dense
          disableGutters
          button
          onClick={(): void => { dispatch(updateCourseCard(id, { web: !web })); }}
        >
          <ListItemIcon>
            <Checkbox
              color="primary"
              checked={web}
            />
          </ListItemIcon>
          <ListItemText>Web Only</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

export default BasicSelect;
