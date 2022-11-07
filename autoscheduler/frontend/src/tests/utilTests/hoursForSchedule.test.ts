import hoursForSchedule from '../../utils/hoursForSchedule';
import {
  testScheduleWith5MinCreditHoursAnd1ExtraMaxCreditHours,
  testScheduleWith6MinCreditHoursAndNullMaxCredits,
  testScheduleWithEqualMinAndMaxCredits,
} from '../testSchedules';
import Schedule from '../../types/Schedule';

describe('hoursForSchedule', () => {
  // when max credits is null, returns just min credits
  // when max credits is null for some sections but not others
  describe('when max credits is null', () => {
    test('it only returns min credits & adds correctly', () => {
      // Arrange
      const schedule: Schedule = {
        meetings: testScheduleWith6MinCreditHoursAndNullMaxCredits,
        name: 'Schedule 1',
        locked: false,
      };

      // Act
      const result = hoursForSchedule(schedule);

      // Assert
      const expected = '6';
      expect(result).toEqual(expected);
    });
  });

  describe('when max credits is null for some sections but not others', () => {
    test('it adds the max credits correctly', () => {
      // Arrange
      const schedule: Schedule = {
        meetings: testScheduleWith5MinCreditHoursAnd1ExtraMaxCreditHours,
        name: 'Schedule 1',
        locked: false,
      };

      // Act
      const result = hoursForSchedule(schedule);

      // Assert
      const expected = '5 - 6';
      expect(result).toEqual(expected);
    });
  });

  describe('when min credits equals max credits', () => {
    test('it does not display max credits', () => {
      // Arrange
      const schedule: Schedule = {
        meetings: testScheduleWithEqualMinAndMaxCredits,
        name: 'Schedule 1',
        locked: false,
      };

      // Act
      const result = hoursForSchedule(schedule);

      // Assert
      const expected = '3';
      expect(result).toEqual(expected);
    });
  });

  describe('when schedule is null', () => {
    test('it returns "-"', () => {
      // Act
      const result = hoursForSchedule(null);

      // Assert
      const expected = '-';
      expect(result).toEqual(expected);
    });
  });
});
