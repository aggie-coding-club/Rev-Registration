import Availability from './Availability';
import { CourseCardArray } from './CourseCardOptions';
import Schedule from './Schedule';

export default interface TermData {
    term: string;
    courseCards: CourseCardArray;
    schedules: Schedule[];
    availability: Availability[];
}
