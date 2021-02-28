import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import About from './About/About';
import setTerm from '../../redux/actions/term';

const LandingPage: React.FC<RouteComponentProps> = () => {
  // Set the term to null so we don't display a term in the navbar when we're on this page
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setTerm(null));
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <HelpText />
      <SelectTerm />
      <About />
    </div>
  );
};

export default LandingPage;
