import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import About from './About/About';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import setTerm from '../../redux/actions/term';
import ga from '../../utils/ga';

const LandingPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setTerm(null));
  }, [dispatch]);

  React.useEffect(() => {
    ga('set', 'page', 'landing');
  });

  return (
    <div className={styles.container}>
      <HelpText />
      <SelectTerm />
      <div className={styles.dialogContainer}>
        <div className={styles.dialogLink}>
          <About />
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
