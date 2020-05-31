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
export function formatTime(h: number, m: number, use24Hour = false): string {
  return `${use24Hour ? h : (h - 1) % 12 + 1}:${
    new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(m)}`;
}
