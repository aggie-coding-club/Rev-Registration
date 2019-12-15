/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import {
  DragDropContext, Draggable, Droppable, DropResult,
} from 'react-beautiful-dnd';
import {
  List, RootRef, Typography,
} from '@material-ui/core';
import DownArrowIcon from '@material-ui/icons/ExpandMore';
import UpArrowIcon from '@material-ui/icons/ExpandLess';

import ProfessorView from './ProfessorView';
import Instructor from '../../../types/Instructor';
import * as styles from './ProfessorSelect.css';

const ProfessorSelect = (): JSX.Element => {
  const [professors, setProfessors] = React.useState<(Instructor | string)[]>([
    new Instructor({ name: 'Dr. Evil' }),
    new Instructor({ name: 'Dr. Frankenstein' }),
    'Worst-case\nDon\t even',
    new Instructor({ name: 'Dr. Doom' }),
    new Instructor({ name: 'Dr. Strangelove' }),
  ]);

  const onDragEnd = (result: DropResult): void => {
    // if dropped outside list, ignore
    if (!result.destination) { return; }

    const tempProfs = Array.from(professors);
    const [movedProf] = tempProfs.splice(result.source.index, 1);
    tempProfs.splice(result.destination.index, 0, movedProf);
    setProfessors(
      tempProfs,
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="uhhhwhat">
        {(provided): JSX.Element => (
          <RootRef rootRef={provided.innerRef}>
            <List disablePadding>
              <div className={styles.label}>
                <Typography>Best-case professor</Typography>
                <DownArrowIcon />
              </div>
              {professors.map((prof, idx) => (
                prof instanceof Instructor
                  ? (
                    <Draggable key={prof.name} draggableId={`${prof.name}`} index={idx}>
                      {(provided2): JSX.Element => (
                        <ProfessorView professor={prof} provided={provided2} />
                      )}
                    </Draggable>
                  )
                  : (
                    <Draggable key={prof} draggableId={prof} index={idx} isDragDisabled>
                      {(provided2): JSX.Element => (
                        <div
                          ref={provided2.innerRef}
                          {...provided2.draggableProps}
                          {...provided2.dragHandleProps}
                        >
                          <div className={`${styles.label} ${styles.withDivider}`}>
                            <Typography>Worst-case professor</Typography>
                            <UpArrowIcon />
                          </div>
                          <div className={styles.label}>
                            <Typography>Don&apos;t even consider</Typography>
                            <DownArrowIcon />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )
              ))}
              {provided.placeholder}
            </List>
          </RootRef>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ProfessorSelect;
