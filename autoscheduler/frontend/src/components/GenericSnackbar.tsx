import * as React from 'react';
import { Snackbar, IconButton, Portal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface GenericSnackbarProps {
  snackbarMessage: string;
  setSnackbarMessage: (message: string) => void;
}

const GenericSnackbar: React.FC<GenericSnackbarProps> = ({
  snackbarMessage, setSnackbarMessage,
}) => {
  const handleSnackbarClose = (_event: any, reason: string): void => {
    if (reason === 'clickaway') return;
    setSnackbarMessage('');
  };

  return (
    <Portal>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={5000}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
        onMouseDown={(evt): void => evt.stopPropagation()}
        action={(
          <IconButton
            aria-label="close"
            onClick={(evt): void => {
              evt.stopPropagation();
              setSnackbarMessage('');
            }}
          >
            <CloseIcon fontSize="small" style={{ color: 'white' }} />
          </IconButton>
        )}
      />
    </Portal>
  );
};

export default GenericSnackbar;
