export const FIRST_HOUR = 8;
export const LAST_HOUR = 21;
/**
 * Given the hours and minutes of a time, returns a formatted string representation of
 * that time. By default, this uses 24-hour format, but an extra argument can be specified
 * to use 12-hour format
 * @param h hours
 * @param m minutes
 * @param use12Hour if true, applies 12-hour format instead of the default 24-hour format
 */
export function formatTime(h: number, m: number, use12Hour = false): string {
  return `${use12Hour ? (h - 1) % 12 + 1 : h}:${
    new Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 }).format(m)}`;
}
