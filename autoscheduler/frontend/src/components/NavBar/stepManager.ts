import * as React from 'react';
import { navigate } from '@reach/router';
import steps from './steps';

// initialize active step context on initial load based on route
export const StepContext = React.createContext([]);

export default function useStepManager():
[number, Set<number>, (idx: number) => void, () => void, () => void] {
  const [activeStep, _setActiveStep, skippedSteps, setSkippedSteps] = React.useContext(StepContext);

  const setActiveStep = (idx: number): void => {
    _setActiveStep(idx);
    navigate(steps[idx].link);
  };

  const handleNext = (): void => {
    console.log(`going from ${activeStep} to ${activeStep + 1}`);
    if (activeStep + 1 >= steps.length) return;

    setActiveStep(activeStep + 1);
    if (skippedSteps.has(activeStep)) {
      const newSkipped = new Set(skippedSteps);
      newSkipped.delete(activeStep);
      setSkippedSteps(newSkipped);
    }
  };

  const handleBack = (): void => {
    if (activeStep - 1 < 0) return;
    setActiveStep(activeStep - 1);
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

  return [activeStep, skippedSteps, handleJump, handleNext, handleBack];
}
