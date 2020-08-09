/**
 * Function to throttles the execution of other functions
 * @param id ID to use, each ID operates on a separate timer
 * @param callback Callback to run after delay expires
 * @param delay Delay (in ms) before running effect
 * @param runOtherIDs Whether to immediately run pending callbacks for IDs other than specified id
 */
const throttle = ((): (id: string, callback: any, delay: number, runOtherIDs: boolean) => void => {
  const timeouts = new Map<string, number>();
  const functions = new Map<string, any>();

  return (id: string, callback: any, delay: number, runOtherIDs = false): void => {
    // Remove old timeout + event listener
    clearTimeout(timeouts.get(id));
    window.removeEventListener('beforeunload', functions.get(id));
    timeouts.delete(id);
    functions.delete(id);

    // If runOtherIDs is specified, clear timeouts for each other ID
    if (runOtherIDs) {
      functions.forEach((fn, key) => {
        clearTimeout(timeouts.get(key));
        timeouts.delete(key);
        fn();
        functions.delete(key);
      });
    }

    // Create new timeout + event listener
    const timeoutID = window.setTimeout(callback, delay);
    timeouts.set(id, timeoutID);

    window.addEventListener('beforeunload', callback);
    functions.set(id, callback);
  };
})();

export default throttle;
