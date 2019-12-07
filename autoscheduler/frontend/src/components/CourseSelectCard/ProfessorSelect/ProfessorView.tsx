/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import DragIcon from '@material-ui/icons/DragHandle';
import { DraggableProvided } from 'react-beautiful-dnd';
import Instructor from '../../../types/Instructor';

interface ProfessorViewProps {
  professor: Instructor;
  provided: DraggableProvided | undefined;
}

const ProfessorView: React.FC<ProfessorViewProps> = ({ professor, provided }): JSX.Element => (
  <ListItem
    ref={provided.innerRef}
    {...provided.draggableProps}
  >
    <ListItemIcon {...provided.dragHandleProps}><DragIcon /></ListItemIcon>
    <ListItemText primary={professor.name} />
  </ListItem>
);

export default ProfessorView;
