import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import ConfigureCard from '../../components/SchedulingPage/ConfigureCard/ConfigureCard';
import autoSchedulerReducer from '../../redux/reducer';
import { updateCourseCard } from '../../redux/actions/courseCards';
import { CustomizationLevel } from '../../types/CourseCardOptions';

describe('ConfigureCard component', () => {
  beforeEach(fetchMock.mockReset);

  describe('makes an API call', () => {
    test('when the user clicks Fetch Schedules', () => {
      let fetchCount = 0;

      fetchMock.mockImplementation((route: string): Promise<Response> => {
        if (route.match(/scheduler\/generate/)) {
          fetchCount += 1;

          // Don't need to return anything valid for this test
          return Promise.resolve(new Response(JSON.stringify([])));
        }

        return Promise.resolve(new Response('404 Not Found'));
      });

      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Generate Schedules'));

      // assert
      expect(fetchCount).toEqual(1);
    });
  });

  describe('shows a loading spinner', () => {
    test('when the user clicks Fetch Schedules', async () => {
      // arrange
      const store = createStore(autoSchedulerReducer);
      const { getByText, findByRole } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      fetchMock.mockImplementation((): Promise<Response> => new Promise(
        (resolve) => setTimeout(resolve, 500, JSON.stringify([])),
      ));

      // act
      fireEvent.click(getByText('Generate Schedules'));
      const loadingSpinner = await findByRole('progressbar');

      // assert
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  describe('Clicking generate schedules', () => {
    test('Does not send honors and web when "SECTION" customization level is selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.SECTION,
        honors: 'exclude',
        web: 'exclude',
      }));

      // Doesn't need to return anything valid
      fetchMock.mockOnce(JSON.stringify([])); // mocks scheduler/generate call

      // act
      fireEvent.click(getByText('Generate Schedules'));

      const { body } = fetchMock.mock.calls[0][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object, then get the honors & web fields
      const { honors, web } = JSON.parse(body.toString());

      // assert
      expect(web).toBeUndefined();
      expect(honors).toBeUndefined();
    });

    test('Does not send sections when "BASIC" customization level is selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.BASIC,
        honors: 'exclude',
        web: 'exclude',
        // Add a selected section so its added to selectedSections internally
        sections: [{
          section: null,
          meetings: [],
          selected: true,
        }],
      }));

      // Doesn't need to return anything valid
      fetchMock.mockOnce(JSON.stringify([])); // mocks scheduler/generate call

      // act
      fireEvent.click(getByText('Generate Schedules'));

      const { body } = fetchMock.mock.calls[0][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object, then get the sections field
      const { sections } = JSON.parse(body.toString());

      // assert
      expect(sections).toBeUndefined();
    });
  });
});
