export const FIRST_HOUR = 8;
export const LAST_HOUR = 22;
/**
 * Given the hours and minutes of a time, returns a formatted string representation of
 * that time. By default, this uses 12-hour format, but an extra argument can be specified
 * to use 24-hour format
 * @param h hours
 * @param m minutes
 * @param use24Hour if true, applies 24-hour format instead of the default 12-hour format
 */
export function formatTime(h: number, m: number, use24Hour = false, padZeroes = false): string {
  let amOrpm = 'AM'
  if (h >= 13) {
    amOrpm = 'PM'
  }
  const formattedHours = use24Hour ? h : (h - 1) % 12 + 1;
  const padZero = new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
  return `${padZeroes ? padZero.format(formattedHours) : formattedHours}:${padZero.format(m)}${amOrpm}`;
}
