import * as React from 'react';

/**
 * Forces component to rerender when run by updating a dummy state value.
 */
export default function useForceRender(): () => void {
  const [, setState] = React.useState<object>();
  return React.useCallback((): void => setState({}), []);
}
