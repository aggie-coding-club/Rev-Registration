import * as React from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { useDispatch } from 'react-redux';
import { Typography, IconButton } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import About from './About/About';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import setTerm from '../../redux/actions/term';

const LandingPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setTerm(null));
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <HelpText />
      <SelectTerm />
      <div className={styles.dialogContainer}>
        <div className={styles.dialogLink}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <IconButton
            className={styles.iconButton}
            disableRipple
            onClick={(): void => {
              // Navigate to the how to use page when clicked
              navigate('/info');
            }}
          >
            <Typography>
                How To Use
            </Typography>
            <OpenInNewIcon />
          </IconButton>
          <About />
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
