import { CourseCardOptions, SectionFilter, SectionSelected } from '../types/CourseCardOptions';

/**
 * Determines whether a section has a value that passes the filter provided
 * @param filter Filter to check
 * @param val Section's value for the filter
 */
function passesFilter(filter: SectionFilter | undefined, val: boolean): boolean {
  if (filter === undefined || filter === SectionFilter.NO_PREFERENCE) return true;
  return (filter === SectionFilter.ONLY) ? val : !val;
}

/**
 * Returns sections of a course matching all of the selected filters
 * @param courseCard Course card to check
 * @returns Whether or not the section should be included based on the selected filters
 */
export default function shouldIncludeSection(
  courseCard: CourseCardOptions, sectionSelected: SectionSelected,
): boolean {
  const { section } = sectionSelected;
  return (
    passesFilter(courseCard.honors, section.honors)
    && passesFilter(courseCard.remote, section.remote)
    && passesFilter(courseCard.asynchronous, section.asynchronous)
    && passesFilter(courseCard.mcallen, section.mcallen)
    && (courseCard.includeFull || section.currentEnrollment < section.maxEnrollment)
  );
}
