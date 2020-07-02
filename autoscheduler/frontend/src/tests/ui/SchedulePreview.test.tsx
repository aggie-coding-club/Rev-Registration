import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, fireEvent, waitFor,
} from '@testing-library/react';
import SchedulePreview, { getAverageGPATextForSchedule } from '../../components/SchedulingPage/SchedulePreview/SchedulePreview';
import autoSchedulerReducer from '../../redux/reducer';
import { replaceSchedules } from '../../redux/actions/schedules';
import { testSchedule1, testSchedule2 } from '../testSchedules';
import Section from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import Grades from '../../types/Grades';

describe('SchedulePreview component', () => {
  describe('updates the selected schedule', () => {
    test('when the user clicks on the second schedule', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findByText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      fireEvent.click(await findByText('Schedule 2'));

      // assert
      expect(store.getState().selectedSchedule).toBe(1);
    });
  });

  describe('getAverageGPATextForSchedule', () => {
    // Helper function that creates a section and meeting with the given properties
    function createMeetingWithGrades(grades: Grades, numCredits: number, id: number): Meeting {
      const section = new Section({
        id,
        crn: id,
        subject: 'SUBJ',
        courseNum: '234',
        sectionNum: '500',
        minCredits: numCredits,
        maxCredits: null,
        currentEnrollment: 56,
        maxEnrollment: 56,
        honors: false,
        web: false,
        instructor: new Instructor({
          name: 'Aakash Tyagi',
        }),
        grades,
      });

      return new Meeting({
        id: (id * 10 + 1),
        building: 'HRBB',
        meetingDays: [true, false, true, false, true, false, false],
        startTimeHours: 10,
        startTimeMinutes: 20,
        endTimeHours: 11,
        endTimeMinutes: 10,
        meetingType: MeetingType.LEC,
        section,
      });
    }

    describe('correctly calculates the average GPA', () => {
      test('for a normal schedule', () => {
        // arrange
        const numCredits = 1;

        const schedule = [
          createMeetingWithGrades(new Grades({
            gpa: 4.0, A: 0, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, Q: 0, X: 0,
          }), numCredits, 0),
          createMeetingWithGrades(new Grades({
            gpa: 3.0, A: 0, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, Q: 0, X: 0,
          }), numCredits, 1),
        ];

        // act
        const result = getAverageGPATextForSchedule(schedule);

        // assert
        expect(result).toEqual('GPA: 3.50'); // ((4.0 * 1) + (3.0 * 1)) / 2.0
      });


      test('when some of the sections dont have grades', () => {
        // arrange
        const numCredits = 1;

        const schedule = [
          createMeetingWithGrades(new Grades({
            gpa: 4.0, A: 0, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, Q: 0, X: 0,
          }), numCredits, 0),
          createMeetingWithGrades(null, numCredits, 1),
        ];

        // act
        const result = getAverageGPATextForSchedule(schedule);

        // assert
        expect(result).toEqual('GPA: 4.00'); // 4.0 is the only GPA in the schedule
      });

      test('when the sections have different credit hours', () => {
        // arrange
        const numCredits0 = 1;
        const numCredits1 = 3;

        const schedule = [
          createMeetingWithGrades(new Grades({
            gpa: 4.0, A: 0, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, Q: 0, X: 0,
          }), numCredits0, 0),
          createMeetingWithGrades(new Grades({
            gpa: 3.0, A: 0, B: 0, C: 0, D: 0, F: 0, I: 0, S: 0, Q: 0, X: 0,
          }), numCredits1, 1),
        ];

        // act
        const result = getAverageGPATextForSchedule(schedule);

        // assert
        expect(result).toEqual('GPA: 3.25'); // ((4.0 * 1) + (3.0 * 3)) / 3
      });
    });

    describe('is N/A', () => {
      test('when there are no sections with grades', () => {
        // arrange
        const numCredits = 1;

        const schedule = [
          createMeetingWithGrades(null, numCredits, 0),
          createMeetingWithGrades(null, numCredits, 1),
        ];

        // act
        const result = getAverageGPATextForSchedule(schedule);

        // assert
        expect(result).toEqual('GPA: N/A');
      });
    });
  });

  describe('saves the correct schedule', () => {
    test('when the first schedule is saved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByTestId } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByTestId('save-schedule'))[0];
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules.savedSchedules).toContainEqual(testSchedule1)
      ));
    });

    test('when a schedule with index greater than 0 is saved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByTestId } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByTestId('save-schedule'))[1];
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules.savedSchedules).toContainEqual(testSchedule2)
      ));
    });
  });

  describe('unsaves the correct schedule', () => {
    test('when the first schedule is unsaved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByTestId, findByTitle } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // save, wait for save to finish, then unsave
      const saveScheduleButton = (await findAllByTestId('save-schedule'))[0];
      fireEvent.click(saveScheduleButton);
      await findByTitle('Unsave');
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules.savedSchedules).toHaveLength(0)
      ));
    });

    test('when a schedule with index greater than 0 is unsaved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByTestId, findByTitle } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // save, wait for save to finish, then unsave
      const saveScheduleButton = (await findAllByTestId('save-schedule'))[1];
      fireEvent.click(saveScheduleButton);
      await findByTitle('Unsave');
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().schedules.savedSchedules).toHaveLength(0)
      ));
    });
  });
});
