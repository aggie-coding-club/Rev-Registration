import * as React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import { Typography, IconButton, Button } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styled from '@material-ui/styles/styled';
import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import About from './About/About';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import setTerm from '../../redux/actions/term';

const Arrow = styled('div')({
  position: 'absolute',
  fontSize: 7,
  width: '3em',
  height: '3em',
  '&::before': {
    content: '""',
    margin: 'auto',
    display: 'block',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
});

const LandingPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const someRef = React.useRef<HTMLDivElement>(null);
  const [arrowRef, setArrowRef] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    dispatch(setTerm(null));
  }, [dispatch]);

  const howToUse: JSX.Element = (
    <div ref={someRef} className={open ? styles.grayOut : null}>
      <IconButton
        className={styles.iconButton}
        disableRipple
        onClick={(): void => {
          // Navigate to the how to use page when clicked
          navigate('/howToUse');
        }}
      >
        <Typography>
          How To Use
        </Typography>
        <OpenInNewIcon />
      </IconButton>
    </div>
  );

  React.useEffect(() => {
    setAnchorEl(someRef.current);
  }, [setAnchorEl]);

  function onClickAway(): void {
    setOpen(false);
  }

  const popper = (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="left"
      modifiers={{

      }}
      // container={document.getElementsByTagName('body')[0]}
      /*
      modifiers={[
        {
          name: 'flip',
          enabled: false,
          options: {
            altBoundary: true,
            rootBoundary: 'viewport',
            padding: 8,
          },
        },
        {
          name: 'arrow',
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
      ]}
      */
    >
      <Box css={{ border: 1, p: 1, bgcolor: 'white' }}>
        <Typography>
          First time using Rev Registration? Click here for a tutorial!
        </Typography>
        <Button onClick={() => { setOpen(false); }}>
          Close
        </Button>
      </Box>
    </Popper>
  );

  return (
    <div className={styles.container}>
      <HelpText />
      <SelectTerm />
      <ClickAwayListener onClickAway={onClickAway}>
        {popper}
      </ClickAwayListener>
      <div className={styles.dialogContainer}>
        <div className={styles.dialogLink}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          {howToUse}
          <About />
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
