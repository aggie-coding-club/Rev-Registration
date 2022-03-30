import Section from '../types/Section';

/**
 * Returns the number of hours for a schedule, depending on if there is a range or not (aka
 * if `maxCredits` is non-null).
 * If there is a range, it will return "{minCredit} - {maxCredit} hours"
 * Also handles "hour" plural handling for `minCredit` (when `maxCredit` is null).
 */
export default function hoursForSection(section: Section): string {
  if (section.maxCredits === null || section.minCredits === section.maxCredits) {
    const minCreditsPlural = section.minCredits > 1 ? 's' : '';
    return `${section.minCredits} hour${minCreditsPlural}`;
  }

  return `${section.minCredits} - ${section.maxCredits} hours`;
}
