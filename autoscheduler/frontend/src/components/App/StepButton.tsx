import * as React from 'react';
import { Button } from '@material-ui/core';
import * as styles from './App.css';
import { useHandleBack, useHandleNext } from '../NavBar/stepManager';

const StepButton: React.FC = () => {
  const handleBack = useHandleBack();
  const handleNext = useHandleNext();

  return (
    <>
      <Button
        variant="contained"
        className={`${styles.stepperButton} ${styles.back}`}
        onClick={handleBack}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={`${styles.stepperButton} ${styles.next}`}
        onClick={handleNext}
      >
        Next
      </Button>
    </>
  );
};

export default StepButton;
