import Grades from '../../types/Grades';
import Instructor from '../../types/Instructor';
import Section, { InstructionalMethod } from '../../types/Section';
import hoursForSection from '../../utils/hoursForSection';

const dummySectionData = {
  id: 0,
  crn: 0,
  subject: 'CSCE',
  courseNum: '121',
  sectionNum: '501',
  currentEnrollment: 0,
  maxEnrollment: 0,
  honors: false,
  remote: false,
  asynchronous: false,
  mcallen: false,
  instructor: new Instructor({ name: 'Something' }),
  grades: null as Grades,
  instructionalMethod: InstructionalMethod.NONE,
};

describe('hoursForSection', () => {
  describe('when maxCredits is null', () => {
    describe('and minCredits == 1', () => {
      test('uses singular hour', () => {
        // Arrange
        const section = new Section({
          ...dummySectionData,
          minCredits: 1,
          maxCredits: null,
        });

        // Act
        const result = hoursForSection(section);

        // Assert
        const expected = '1 hour';
        expect(result).toEqual(expected);
      });
    });

    describe('and minCredits > 1', () => {
      test('uses plural hours', () => {
        // Arrange
        const section = new Section({
          ...dummySectionData,
          minCredits: 3,
          maxCredits: null,
        });

        // Act
        const result = hoursForSection(section);

        // Assert
        const expected = '3 hours';
        expect(result).toEqual(expected);
      });
    });
  });

  describe('when maxCredits is not null', () => {
    test('returns the correct range', () => {
      // Arrange
      const section = new Section({
        ...dummySectionData,
        minCredits: 3,
        maxCredits: 5,
      });

      // Act
      const result = hoursForSection(section);

      // Assert
      const expected = '3 - 5 hours';
      expect(result).toEqual(expected);
    });

    describe('and when maxCredits equals minCredits', () => {
      test('returns only minCredits', () => {
        // Arrange
        const section = new Section({
          ...dummySectionData,
          minCredits: 3,
          maxCredits: 3,
        });

        // Act
        const result = hoursForSection(section);

        // Assert
        const expected = '3 hours';
        expect(result).toEqual(expected);
      });
    });
  });
});
