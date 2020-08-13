import * as React from 'react';
import { Button } from '@material-ui/core';
import * as styles from './App.css';
import useStepManager from '../NavBar/stepManager';

const StepButton: React.FC = () => {
  const [,,, handleNext, handleBack] = useStepManager();
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
