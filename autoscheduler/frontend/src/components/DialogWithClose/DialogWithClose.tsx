import * as React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogProps, DialogTitle,
  IconButton, ThemeProvider, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import * as styles from './DialogWithClose.css';
import { whiteButtonTheme } from '../../theme';

interface DialogWithCloseProps {
  title: string;
  actions?: JSX.Element;
}

// Use destructuring to allow passing props to the Dialog
/* eslint-disable react/destructuring-assignment, react/jsx-props-no-spreading */
const DialogWithClose: React.FC<DialogProps & DialogWithCloseProps> = (props) => {
  const actions = props.actions ? (
    <DialogActions>
      {props.actions}
    </DialogActions>
  ) : undefined;

  return (
    <Dialog {...props} maxWidth={props.maxWidth || 'md'}>
      <DialogTitle disableTypography>
        <div className={styles.dialogTitle}>
          <Typography variant="h6">
            {props.title}
          </Typography>
          <ThemeProvider theme={whiteButtonTheme}>
            <IconButton className={styles.closeButton} color="primary" onClick={(e): void => props.onClose(e, 'backdropClick')}>
              <CloseIcon />
            </IconButton>
          </ThemeProvider>
        </div>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {props.children}
      </DialogContent>
      {actions}
    </Dialog>
  );
};

export default DialogWithClose;
