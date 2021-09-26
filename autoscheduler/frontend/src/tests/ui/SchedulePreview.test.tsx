import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  render, fireEvent, waitFor, waitForElementToBeRemoved,
} from '@testing-library/react';
import SchedulePreview from '../../components/SchedulingPage/SchedulePreview/SchedulePreview';
import autoSchedulerReducer from '../../redux/reducer';
import { replaceSchedules, setSchedules } from '../../redux/actions/schedules';
import { testSchedule1, testSchedule2 } from '../testSchedules';
import Section, { InstructionalMethod } from '../../types/Section';
import Instructor from '../../types/Instructor';
import Meeting, { MeetingType } from '../../types/Meeting';
import setTerm from '../../redux/actions/term';
import Schedule from '../../types/Schedule';
import { mockGetSavedSchedules } from '../testData';
import { SaveSchedulesRequest } from '../../types/APIRequests';

describe('SchedulePreview component', () => {
  describe('updates the selected schedule', () => {
    test('when the user clicks on the second schedule', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const schedules = await findAllByLabelText('Schedule preview');
      fireEvent.click(schedules[1]);

      // assert
      expect(store.getState().selectedSchedule).toBe(1);
    });
  });

  describe('saves the correct schedule', () => {
    test('when the first schedule is saved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[0];
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().termData.schedules[0].saved).toBe(true)
      ));
    });

    test('when a schedule with index greater than 0 is saved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[1];
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(store.getState().termData.schedules[1].saved).toBe(true)
      ));
    });
  });

  describe('unsaves the correct schedule', () => {
    test('when the first schedule is unsaved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText, findByTitle } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // save, wait for save to finish, then unsave
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[0];
      fireEvent.click(saveScheduleButton);
      await findByTitle('Unsave');
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(
          store.getState().termData.schedules.filter((schedule) => schedule.saved),
        ).toHaveLength(0)
      ));
    });

    test('when a schedule with index greater than 0 is unsaved', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText, findByTitle } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // save, wait for save to finish, then unsave
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[1];
      fireEvent.click(saveScheduleButton);
      await findByTitle('Unsave');
      fireEvent.click(saveScheduleButton);

      // assert
      await waitFor(() => (
        expect(
          store.getState().termData.schedules.filter((schedule) => schedule.saved),
        ).toHaveLength(0)
      ));
    });
  });

  describe('deletes the correct schedule', () => {
    test('when an unsaved schedule is deleted', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const deleteScheduleButton = (await findAllByLabelText('Delete schedule'))[1];
      fireEvent.click(deleteScheduleButton);

      // assert
      const { schedules } = store.getState().termData;
      expect(schedules).toHaveLength(1);
      expect(schedules[0].meetings).toEqual(testSchedule1);
    });

    test('when deleted from the dialog from a saved schedule', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { findAllByLabelText, getByText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      const saveScheduleButton = (await findAllByLabelText('Save schedule'))[1];
      fireEvent.click(saveScheduleButton);

      const deleteScheduleButton = (await findAllByLabelText('Delete schedule'))[1];
      fireEvent.click(deleteScheduleButton);

      const confirmDeleteButton = getByText('Delete');
      fireEvent.click(confirmDeleteButton);

      // assert
      const { schedules } = store.getState().termData;
      expect(schedules).toHaveLength(1);
      expect(schedules[0].saved).toBe(false);
      expect(schedules[0].meetings).toEqual(testSchedule1);
    });
  });

  describe('renames the correct schedule', () => {
    test('when the first schedule is renamed', async () => {
      // arrange
      const newScheduleName = 'Test schedule';

      const store = createStore(autoSchedulerReducer);
      const { findByLabelText, findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // click button to rename schedule
      const renameScheduleButton = (await findAllByLabelText('Rename schedule'))[0];
      fireEvent.click(renameScheduleButton);

      // set new name
      const scheduleNameInput = (await findByLabelText('Schedule name'));
      if (!(scheduleNameInput instanceof HTMLInputElement)) throw Error('Input element is not valid');
      fireEvent.change(scheduleNameInput, { target: { value: newScheduleName } });

      // confirm new name
      fireEvent.click(renameScheduleButton);

      // assert
      expect(store.getState().termData.schedules[0].name).toBe(newScheduleName);
    });

    test('when the second schedule is renamed', async () => {
      // arrange
      const newScheduleName = 'Cool classes for cool kids';

      const store = createStore(autoSchedulerReducer);
      const { findByLabelText, findAllByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );
      store.dispatch(replaceSchedules([testSchedule1, testSchedule2]));

      // act
      // click button to rename schedule
      const renameScheduleButton = (await findAllByLabelText('Rename schedule'))[1];
      fireEvent.click(renameScheduleButton);

      // set new name
      const scheduleNameInput = (await findByLabelText('Schedule name'));
      if (!(scheduleNameInput instanceof HTMLInputElement)) throw Error('Input element is not valid');
      fireEvent.change(scheduleNameInput, { target: { value: newScheduleName } });

      // confirm new name
      fireEvent.click(renameScheduleButton);

      // assert
      expect(store.getState().termData.schedules[1].name).toBe(newScheduleName);
    });
  });

  describe('saved schedules', () => {
    beforeEach(fetchMock.mockReset);
    const exampleSchedules: Schedule[] = [{
      name: 'Schedule 1',
      meetings: [new Meeting({
        id: 87328,
        meetingDays: [false, true, false, true, false, true, false],
        startTimeHours: 9,
        startTimeMinutes: 10,
        endTimeHours: 10,
        endTimeMinutes: 0,
        meetingType: MeetingType.LEC,
        building: 'BLOC',
        room: '',
        section: new Section({
          id: 830262,
          crn: 67890,
          subject: 'MATH',
          courseNum: '151',
          sectionNum: '201',
          minCredits: 0,
          maxCredits: null,
          currentEnrollment: 0,
          maxEnrollment: 0,
          honors: true,
          remote: false,
          asynchronous: false,
          instructor: new Instructor({ name: 'Dr. Pepper' }),
          grades: null,
          instructionalMethod: InstructionalMethod.NONE,
        }),
      })],
      saved: true,
    }];

    describe('correctly serializes schedules', () => {
      test('and sends it in sessions/save_schedules', async () => {
        // arrange
        fetchMock.mockResponseOnce('[]'); // mock sessions/get_saved_schedules
        fetchMock.mockResponseOnce(''); // Mock 200 OK for sessions/save_schedules

        const store = createStore(autoSchedulerReducer);

        // Term must be set for save_schedules to go through
        const term = '202031';
        store.dispatch(setTerm(term));

        // Save schedules
        const expected: SaveSchedulesRequest = {
          term,
          schedules: [{
            name: 'Schedule 1',
            sections: [830262],
          }],
        };

        render(
          <Provider store={store}>
            <SchedulePreview throttleTime={1} hideLoadingIndicator />
          </Provider>,
        );

        // act
        await new Promise(setImmediate);
        // Reset fetchMock calls to ignore the empty save_schedules fetch
        fetchMock.mock.calls = [];

        store.dispatch(setSchedules(exampleSchedules, term));
        await new Promise(setImmediate);

        // assert
        let called = false;
        fetchMock.mock.calls.forEach((call) => {
          if (call[0] === 'sessions/save_schedules') {
            called = true;
            expect(JSON.parse(call[1].body.toString())).toEqual(expected);
          }
        });

        if (!called) {
          throw Error('sessions/save_schedules wasnt called!');
        }
      });
    });

    describe('correctly parses schedules', () => {
      test('from sessions/get_saved_schedules', async () => {
        // arrange
        const store = createStore(autoSchedulerReducer);
        store.dispatch(setTerm('202031'));
        fetchMock.mockImplementationOnce(mockGetSavedSchedules);

        // act
        render(
          <Provider store={store}>
            <SchedulePreview hideLoadingIndicator />
          </Provider>,
        );

        await new Promise(setImmediate);

        // assert
        expect(store.getState().termData.schedules).toEqual(exampleSchedules);
      });
    });
  });

  describe('details dialog', () => {
    beforeEach(fetchMock.mockReset);

    // "Template" for meetings, subject/course num will be overwritten
    const meetingTemplate = {
      id: 12345,
      meetingDays: [false, true, false, true, false, true, false],
      startTimeHours: 9,
      startTimeMinutes: 10,
      endTimeHours: 10,
      endTimeMinutes: 0,
      meetingType: MeetingType.LEC,
      building: 'BLOC',
      section: new Section({
        id: 123451,
        crn: 11111,
        subject: 'NONE',
        courseNum: '0',
        sectionNum: '0',
        minCredits: 0,
        maxCredits: null,
        currentEnrollment: 0,
        maxEnrollment: 0,
        honors: false,
        remote: false,
        asynchronous: false,
        instructor: new Instructor({ name: 'jimbles notronbo' }),
        grades: null,
        instructionalMethod: InstructionalMethod.NONE,
      }),
    };

    const mathMeeting = new Meeting({
      ...meetingTemplate,
      section: new Section({
        ...meetingTemplate.section,
        subject: 'MATH',
        courseNum: '151',
        sectionNum: '201',
        honors: true,
      }),
    });

    const csceMeeting = new Meeting({
      ...meetingTemplate,
      section: new Section({
        ...meetingTemplate.section,
        subject: 'CSCE',
        courseNum: '121',
        sectionNum: '501',
      }),
    });

    const chemMeeting = new Meeting({
      ...meetingTemplate,
      section: new Section({
        ...meetingTemplate.section,
        subject: 'CHEM',
        courseNum: '107',
        sectionNum: '502',
      }),
    });

    const exampleSchedules: Schedule[] = [{
      name: 'Schedule 1',
      meetings: [csceMeeting],
      saved: false,
    }, {
      name: 'Schedule 2',
      meetings: [chemMeeting],
      saved: false,
    }, {
      name: 'Schedule 3',
      meetings: [mathMeeting],
      saved: true,
    }];

    test('appears when the details button is clicked', async () => {
      // arrange
      fetchMock.mockResponseOnce('[]'); // mock sessions/get_saved_schedules
      fetchMock.mockResponseOnce(''); // Mock 200 OK for sessions/save_schedules

      const store = createStore(autoSchedulerReducer);

      // Term must be set for save_schedules to go through
      const term = '202031';
      store.dispatch(setTerm(term));

      const { getAllByText, getByText } = render(
        <Provider store={store}>
          <SchedulePreview throttleTime={1} hideLoadingIndicator />
        </Provider>,
      );

      // Generate schedules
      await new Promise(setImmediate);
      store.dispatch(setSchedules(exampleSchedules, term));
      await new Promise(setImmediate);

      // act
      fireEvent.click(getAllByText('Details')[0]);

      // assert
      expect(getByText('Schedule 1 - Details')).toBeInTheDocument();
    });
  });

  describe('re-shows the schedules loading indicator', () => {
    test('when we set the term, it shows+disappears, then we change the term again', async () => {
      // arrange
      fetchMock.mockResponseOnce('[]'); // sessions/get_saved_schedules
      fetchMock.mockResponseOnce('[]'); // sessions/save_schedules
      fetchMock.mockResponseOnce('[]'); // sessions/get_saved_schedules
      fetchMock.mockResponseOnce('[]'); // sessions/save_schedules

      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031'));

      const { queryByLabelText } = render(
        <Provider store={store}>
          <SchedulePreview />
        </Provider>,
      );

      // wait for loading indicator to disappear
      await waitForElementToBeRemoved(
        () => queryByLabelText('schedules-loading-indicator'),
      );

      // act
      store.dispatch(setTerm('202011'));

      // assert
      await waitFor(
        () => expect(queryByLabelText('schedules-loading-indicator')).toBeInTheDocument(),
      );
    });
  });

  describe('clears the schedules', () => {
    test('when we change terms', async () => {
      // arrange
      fetchMock.mockResponseOnce('[]'); // sessions/get_saved_schedules
      fetchMock.mockResponseOnce('[]'); // sessions/save_schedules
      fetchMock.mockResponseOnce('[]'); // sessions/get_saved_schedules
      fetchMock.mockResponseOnce('[]'); // sessions/save_schedules

      const store = createStore(autoSchedulerReducer);
      store.dispatch(setTerm('202031'));

      const { queryByText } = render(
        <Provider store={store}>
          <SchedulePreview hideLoadingIndicator />
        </Provider>,
      );

      // wait for loading indicator to disappear
      store.dispatch(setSchedules([{
        name: 'Schedule 1',
        meetings: testSchedule1,
        saved: false,
      }], '202031'));

      // pre-condition
      expect(queryByText('Schedule 1')).toBeInTheDocument();

      // act
      store.dispatch(setTerm('202011'));
      await new Promise(setImmediate);

      // assert
      expect(queryByText('Schedule 1')).not.toBeInTheDocument();
    });
  });
});
