import * as React from 'react';
import { RouteComponentProps } from '@reach/router';
import { useDispatch } from 'react-redux';
import HelpText from './HelpText/HelpText';
import SelectTerm from './SelectTerm/SelectTerm';
import * as styles from './LandingPage.css';
import setTerm from '../../redux/actions/term';

const LandingPage: React.FC<RouteComponentProps> = () => {
  // Set the term to null so we don't display a term in the navbar when we're on this page
  const dispatch = useDispatch();
  dispatch(setTerm(null));

  return (
    <div className={styles.container}>
      <HelpText />
      <SelectTerm />
    </div>
  );
};

export default LandingPage;
