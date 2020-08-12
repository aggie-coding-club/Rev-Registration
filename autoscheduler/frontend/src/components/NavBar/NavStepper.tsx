import * as React from 'react';
import {
  Stepper, Step, StepLabel, StepIcon, SvgIconTypeMap,
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import ClockIcon from '@material-ui/icons/Schedule';
import SwapIcon from '@material-ui/icons/SwapHoriz';
import DoneIcon from '@material-ui/icons/Done';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { navigate } from '@reach/router';
import * as styles from './NavStepper.css';

interface StepData {
  label: string;
  link: string;
  icon: OverridableComponent<SvgIconTypeMap>;
}

interface NavStepperProps {
  route: string;
}

const NavStepper: React.FC<NavStepperProps> = ({ route }) => {
  const [activeStep, _setActiveStep] = React.useState(0);
  const [skippedSteps, setSkippedSteps] = React.useState(new Set<number>());

  const steps: StepData[] = [
    {
      label: 'Select courses',
      link: '/select-courses',
      icon: ListIcon,
    },
    {
      label: 'Select times',
      link: '/select-times',
      icon: ClockIcon,

    },
    {
      label: 'Fetch schedules',
      link: '/schedules',
      icon: ClockIcon,
    },
    {
      label: 'Customize',
      link: '/customize-schedule',
      icon: SwapIcon,
    },
    {
      label: 'Show CRN\'s',
      link: '/show-crn',
      icon: DoneIcon,
    },
  ];

  const setActiveStep = (idx: number): void => {
    _setActiveStep(idx);
    navigate(steps[idx].link);
  };

  // set active step on initial load based on route
  React.useEffect(() => {
    _setActiveStep(steps.findIndex(({ link }) => link === route));
  }, [route, steps]);

  const handleNext = (): void => {
    setActiveStep(activeStep + 1);
    if (skippedSteps.has(activeStep)) {
      const newSkipped = new Set(skippedSteps);
      newSkipped.delete(activeStep);
      setSkippedSteps(newSkipped);
    }
  };

  const handleJump = (idx: number): void => {
    // if we're "jumping" to the next step, we don't have to worry about skipping
    if (idx === activeStep + 1) {
      handleNext();
      return;
    }

    setActiveStep(idx);
    const newSkipped = new Set(skippedSteps);
    for (let step = activeStep + 1; step < idx; step++) {
      newSkipped.add(step);
    }
    setSkippedSteps(newSkipped);
  };

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
