import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import {
  render, fireEvent, waitFor, queryByText as queryContainerByText,
} from '@testing-library/react';
import autoSchedulerReducer from '../../redux/reducer';
import SchedulingPage from '../../components/SchedulingPage/SchedulingPage';
import { mockFetchSchedulerGenerate } from '../testData';

// Mocks navigate, so we can assert that it redirected to the correct url for Redirects to /schedule
// This must be outside of all describes in order to function correctly
jest.mock('@reach/router', () => ({
  navigate: jest.fn(),
}));

describe('Scheduling Page UI', () => {
  describe('when selected term is null, ', () => {
    // sine we wait for it to redirect, need to reset it for the other tests
    beforeAll(fetchMock.mockReset);
    afterAll(fetchMock.mockReset);

    test('redirect to home page', () => {

      // should redirect itself automaticall


      // asser

      // see jest.mock at top of the fil

      waitFor(() => expect(navigate).toHaveBeenCalledWith('/schedule'))

    })

  })


  describe('indicates that there are no schedules', () => 

    test('when there are no schedules to show', async () => 

      // arrang

      const store = createStore(autoSchedulerReducer)


      // sessions/get_last_ter

      fetchMock.mockResponseOnce(JSON.stringify({}))


      const { findByText } = render

        <Provider store={store}

          <SchedulingPage /

        </Provider>

      )


      // nothing to act o


      // asser

      expect(await findByText('No schedules available.')).toBeTruthy()

    })

  })

  describe('adds schedules to the Schedule Preview', () => 

    test('when the user clicks Generate Schedules', async () => 

      // arrang

      const store = createStore(autoSchedulerReducer)


      // sessions/get_last_ter

      fetchMock.mockResponseOnce(JSON.stringify({}))


      const { getByText, queryByText } = render

        <Provider store={store}

          <SchedulingPage /

        </Provider>

      )


      // Mock scheduler/generat

      fetchMock.mockImplementationOnce(mockFetchSchedulerGenerate)


      // ac

      fireEvent.click(getByText('Generate Schedules'))

      await waitFor(() => {})


      // asser

      expect(queryByText('No schedules available')).toBeFalsy()

      expect(queryByText('Schedule 1')).toBeTruthy()

    })

  })


  describe('changes the meetings shown in the Schedule', () => 

    test('when the user clicks on a different schedule in the Schedule Preview', async () => 

      // arrang

      const store = createStore(autoSchedulerReducer)


      // sessions/get_last_ter

      fetchMock.mockResponseOnce(JSON.stringify({}))


      const 

        getByLabelText, getByRole, findByText, findAllByText

      } = render

        <Provider store={store}

          <SchedulingPage /

        </Provider>

      )


      // Mock scheduler/generate

      fetchMock.mockImplementationOnce(mockFetchSchedulerGenerate)


      // ac

      fireEvent.click(getByRole('button', { name: 'Generate Schedules' }))

      const schedule2 = await findByText('Schedule 2')

      fireEvent.click(schedule2)

      // DEPT 123 will be added to the schedule no matter which schedule is chose

      await findAllByText(/DEPT 123.*/)

      const calendarDay = getByLabelText('Tuesday')


      // asser

      // Schedule 1 has section 501 in i

      // Schedule 2 has section 200 instea

      // we check Tuesday to avoid selecting the equivalent text in SchedulePrevie

      expect(queryContainerByText(calendarDay, /CSCE 121-501.*/)).toBeFalsy()

      expect(queryContainerByText(calendarDay, /CSCE 121-200.*/)).toBeTruthy()

    })

  })


  describe('updates redux term based on sessions/get_last_term result', () => 

    test('when the page is loaded', async () => 

      // arrang

      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk))


      // sessions/get_last_ter

      fetchMock.mockResponseOnce(JSON.stringify({ term: '202031' }))

      // sessions/get_saved_course

      fetchMock.mockResponseOnce(JSON.stringify({}))


      render

        <Provider store={store}

          <SchedulingPage /

        </Provider>

      )


      const { term } = store.getState()


      // asser

      waitFor(() => expect(term).toBe('202031'))

    })

  })

})

