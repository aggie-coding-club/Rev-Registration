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
import testFetch from '../testData';

describe('ConfigureCard component', () => {
  beforeEach(fetchMock.mockReset);

  describe('makes an API call', () => {
    test('when the user clicks Fetch Schedules', () => {
      // arrange
      fetchMock.mockOnce('[]');

      const store = createStore(autoSchedulerReducer);
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      // act
      fireEvent.click(getByText('Generate Schedules'));

      // assert
      expect(fetchMock).toBeCalledWith('scheduler/generate', expect.any(Object));
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
        (resolve) => setTimeout(resolve, 500, {
          json: (): any[] => [],
        }),
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

      fetchMock.mockImplementationOnce(testFetch); // Mock api/sections
      // Doesn't need to return anything valid
      fetchMock.mockOnce('[]'); // mocks scheduler/generate call

      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.SECTION,
        honors: 'include',
        web: 'include',
        course: 'CSCE 121',
      }, '201931'));

      const cardSections = store.getState().courseCards[0].sections;

      // Make all of the sections selected
      store.dispatch<any>(updateCourseCard(0, {
        sections: cardSections.map((sec) => ({
          section: sec.section,
          selected: true,
          meetings: sec.meetings,
        })),
      }));

      // act
      fireEvent.click(getByText('Generate Schedules'));

      // second call is the /scheduler/generate call. Second index of that call is the body
      const { body } = fetchMock.mock.calls[1][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object, then get the honors & web fields
      const { courses } = JSON.parse(body.toString());
      const { honors, web } = courses[0];

      // assert
      // no_preference is the default value
      expect(web).toEqual('no_preference');
      expect(honors).toEqual('no_preference');
    });

    test('Does not send sections when "BASIC" customization level is selected', () => {
      // arrange
      const store = createStore(autoSchedulerReducer, applyMiddleware(thunk));
      const { getByText } = render(
        <Provider store={store}>
          <ConfigureCard />
        </Provider>,
      );

      fetchMock.mockImplementationOnce(testFetch);
      fetchMock.mockOnce('[]'); // mocks scheduler/generate call

      store.dispatch<any>(updateCourseCard(0, {
        customizationLevel: CustomizationLevel.BASIC,
        honors: 'exclude',
        web: 'exclude',
        // Add a selected section so its added to selectedSections internally
        course: 'CSCE 121',
      }, '201931'));

      const cardSections = store.getState().courseCards[0].sections;

      // Make all of the sections selected
      store.dispatch<any>(updateCourseCard(0, {
        sections: cardSections.map((sec) => ({
          section: sec.section,
          selected: true,
          meetings: sec.meetings,
        })),
      }));

      // act
      fireEvent.click(getByText('Generate Schedules'));

      const { body } = fetchMock.mock.calls[1][1]; // Body is returned as a "blob"
      // Convert the body into a string, parse it into an object, then get the courses field
      const { courses } = JSON.parse(body.toString());
      const { sections } = courses[0];

      // assert
      expect(sections.length).toEqual(0);
    });
  });
});
