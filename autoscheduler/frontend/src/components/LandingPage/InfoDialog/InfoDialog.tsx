import * as React from 'react';
import {
  Link, Typography,
} from '@material-ui/core';
import * as styles from './InfoDialog.css';
import DialogWithClose from '../../DialogWithClose/DialogWithClose';

interface InfoDialogProps {
  title: string;
  linkText: string;
}

const InfoDialog: React.FC<React.PropsWithChildren<InfoDialogProps>> = ({
  title, linkText, children,
}) => {
  const [open, setOpen] = React.useState(false);

  const link: JSX.Element = (
    <div className={styles.link}>
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

  const onDialogClose = (): void => setOpen(false);

  return (
    <div>
      {link}
      <DialogWithClose title={title} open={open} onClose={onDialogClose}>
        {children}
      </DialogWithClose>
    </div>
  );
};

export default InfoDialog;
