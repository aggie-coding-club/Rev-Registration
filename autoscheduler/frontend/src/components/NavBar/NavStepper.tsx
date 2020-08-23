import * as React from 'react';
import {
  Stepper, Step, StepLabel, StepIcon,
} from '@material-ui/core';
import steps, { StepData } from './steps';
import * as styles from './NavStepper.css';
import { useActiveStep, useSkippedSteps, useHandleJump } from './stepManager';

const NavStepper: React.FC = () => {
  const activeStep = useActiveStep();
  const skippedSteps = useSkippedSteps();
  const handleJump = useHandleJump();

  const makeStep = ({ label, icon }: StepData, idx: number): JSX.Element => (
    <Step
      key={idx}
      onClick={(): void => handleJump(idx)}
      completed={idx < activeStep && !skippedSteps.has(idx)}
    >
      <StepIcon
        icon={React.createElement(icon, { classes: { root: styles.centeredIcon } })}
      />
      <StepLabel classes={
        { label: styles.label, active: styles.labelActive, completed: styles.labelCompleted }
      }
      >
        {label}
      </StepLabel>
    </Step>
  );

  return (
    <Stepper activeStep={activeStep} classes={{ root: styles.stepper }}>
      {steps.map(makeStep)}
    </Stepper>
  );
};

export default NavStepper;
