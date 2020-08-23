import * as React from 'react';
import { navigate } from '@reach/router';
import steps from './steps';

// initialize active step context on initial load based on route
export const StepContext = React.createContext([]);

function useSetActiveStep(_setActiveStep: (idx: number) => void): (idx: number) => void {
  return (idx: number): void => {
    _setActiveStep(idx);
    navigate(steps[idx].link);
  };
}

export function useHandleNext(): VoidFunction {
  const [activeStep, _setActiveStep, skippedSteps, setSkippedSteps] = React.useContext(StepContext);
  const setActiveStep = useSetActiveStep(_setActiveStep);

  return (): void => {
    console.log(`going from ${activeStep} to ${activeStep + 1}`);
    if (activeStep + 1 >= steps.length) return;

    setActiveStep(activeStep + 1);
    if (skippedSteps.has(activeStep)) {
      const newSkipped = new Set(skippedSteps);
      newSkipped.delete(activeStep);
      setSkippedSteps(newSkipped);
    }
  };
}

export function useHandleBack(): VoidFunction {
  const [activeStep, _setActiveStep] = React.useContext(StepContext);
  const setActiveStep = useSetActiveStep(_setActiveStep);

  return (): void => {
    if (activeStep - 1 < 0) return;
    setActiveStep(activeStep - 1);
  };
}

export function useHandleJump(): (idx: number) => void {
  const [activeStep, _setActiveStep, skippedSteps, setSkippedSteps] = React.useContext(StepContext);
  const setActiveStep = useSetActiveStep(_setActiveStep);
  const handleNext = useHandleNext();

  return (idx: number): void => {
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
}

export function useActiveStep(): number {
  const [activeStep] = React.useContext(StepContext);

  return activeStep;
}

export function useSkippedSteps(): Set<number> {
  const [,, skippedSteps] = React.useContext(StepContext);
  return skippedSteps;
}
