import * as React from 'react';
import {
  Dialog, DialogContent, DialogTitle, IconButton, Link, ThemeProvider, Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { whiteButtonTheme } from '../../../theme';
import * as styles from './InfoDialog.css';

interface InfoDialogProps {
  title: string;
  linkText: string;
}

const InfoDialog: React.FC<React.PropsWithChildren<InfoDialogProps>> = ({
  title, linkText, children,
}) => {
  const [open, setOpen] = React.useState(false);

  const dialog: JSX.Element = (
    <Dialog
      open={open}
      onClose={(): void => setOpen(false)}
    >
      <DialogTitle disableTypography>
        <div className={styles.dialogTitle}>
          <Typography variant="h6">
            {title}
          </Typography>
          <ThemeProvider theme={whiteButtonTheme}>
            <IconButton
              className={styles.closeButton}
              color="primary"
              onClick={(): void => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </ThemeProvider>
        </div>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        {children}
      </DialogContent>
    </Dialog>
  );

  const link: JSX.Element = (
    <div>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link
        component="button"
        variant="body2"
        onClick={(): void => {
          setOpen(true);
        }}
      >
        <Typography>
          {linkText}
        </Typography>
      </Link>
    </div>
  );

  return (
    <div>
      {link}
      {dialog}
    </div>
  );
};

export default InfoDialog;
