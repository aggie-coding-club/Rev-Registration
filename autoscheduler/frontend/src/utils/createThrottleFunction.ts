/**
 * Generates a function that throttles execution of other functions(specified by callback). If
 * throttle is called again with the same id before delay ms has passed, it runs the new callback
 * once the timer is over instead of running the old one. Each id works on a separate timer.
 * To use, put the following line at the top of a module:
 * const throttle = createThrottleFunction();
 * Then to use it, use "throttle(id, callback, delay, runOtherIds)"
 * @param id ID to use, each ID operates on a separate timer
 * @param callback Callback to run after delay expires
 * @param delay Delay (in ms) before running effect
 * @param runOtherIDs Whether to immediately run pending callbacks for IDs other than specified id
 */
const createThrottleFunction = (): (
  id: string, callback: any, delay: number, runOtherIDs: boolean) => void => {
  const intervals = new Map<string, number>();
  const intervalTimes = new Map<string, number>();
  const functions = new Map<string, any>();

  return (id: string, callback: any, delay: number, runOtherIDs = false): void => {
    // Update interval frequency if needed
    if (delay !== intervalTimes.get(id)) {
      // Remove old callback, since the new one has already run
      functions.delete(id);

      // Update interval with new delay
      intervalTimes.set(id, delay);
      clearInterval(intervals.get(id));
      setInterval(() => {
        // At the end of each interval, run callback if it's been updated since the last run,
        // then remove the event listener as it's no longer needed
        const toRun = functions.get(id);
        if (typeof toRun === 'function') toRun();
        functions.delete(id);
        window.removeEventListener('beforeunload', toRun);
      }, delay);
    }

    // If runOtherIDs is specified, run and clear timeouts for each other ID
    if (runOtherIDs) {
      functions.forEach((fn, key) => {
        if (key !== id) {
          clearInterval(intervals.get(key));
          intervals.delete(key);
          intervalTimes.delete(key);
          functions.delete(key);
          window.removeEventListener('beforeunload', fn);
          fn();
        }
      });
    }

    // Update beforeunload event listener so callback is fired before close/refresh
    window.removeEventListener('beforeunload', functions.get(id));
    window.addEventListener('beforeunload', callback);

    // Update function to run when interval completes
    functions.set(id, callback);
  };
};

export default createThrottleFunction;
