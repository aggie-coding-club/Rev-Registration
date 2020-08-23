import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
// THESE TESTS ARE BROKEN. DO NOT TRUST/RELY ON THEM

enableFetchMocks();
/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import {
  render, fireEvent, waitFor, act,
} from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import NavBar from '../../components/NavBar';
import autoSchedulerReducer from '../../redux/reducer';

// Mocks navigate, so we can assert that it redirected to the correct url for Redirects to /schedule
// This must be outside of all describes in order to function correctly
jest.mock('@reach/router', () => ({
  navigate: jest.fn(),
}));

// Mocks successful fetch call to sessions/get_full_name
const mockSuccessfulGetNameAPI = (): void => {
  fetchMock.mockResponseOnce(JSON.stringify({
    fullName: 'Bob Bobbins',
  }));
};

// Mocks failed (status:400) fetch call to sessions/get_full_name
const mockFailedGetNameAPI = (): void => {
  fetchMock.mockResponseOnce('', {
    status: 400,
  });
};

// Mocks the fetch call to sessions/get_is_logged_in returning true
const mockTrueGetIsLoggedInAPI = (): void => {
  fetchMock.mockResponseOnce(JSON.stringify({
    isLoggedIn: true,
  }));
};

// Mocks the fetch call to sessions/get_is_logged_in returning false
const mockFalseGetIsLoggedInAPI = (): void => {
  fetchMock.mockResponseOnce(JSON.stringify({
    isLoggedIn: false,
  }));
};

// Mocks status of a logged out user
const MockLoggedOutStatus = (): void => {
  mockFalseGetIsLoggedInAPI();
  mockFailedGetNameAPI();
};

// Mocks status of a logged in user
const MockLoggedInStatus = (): void => {
  mockTrueGetIsLoggedInAPI();
  mockSuccessfulGetNameAPI();
};


describe('login button', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('appears when user is logged out', async () => {
    // arrange
    // THIS TEST SHOULD BE WORKING CORRECTLY
    MockLoggedOutStatus();
    const store = createStore(autoSchedulerReducer);

    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const loginButton = await findByRole('button', { name: 'Login With Google' });

    // assert
    expect(loginButton).toBeInTheDocument();
  });

  test('does not appear when user is logged in', async () => {
    // arrange
    // MIGHT BE WRITTEN RIGHT OR I JUST GOT LUCKY
    MockLoggedInStatus();
    const store = createStore(autoSchedulerReducer);

    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const loginButton = await findByRole('button', { name: 'Login With Google' });

    // assert
    expect(loginButton).not.toBeInTheDocument();
  });

  test('Redirects to /login/google-oauth2/ when clicked', async () => {
    // arrange
    // DOESN'T WORK! ALWAYS PASSESS EVEN WHEN REPLACED WITH .not.toHaveBeenCalled
    // OR WRONG PARAMETERS
    MockLoggedOutStatus();
    window.open = jest.fn();
    const store = createStore(autoSchedulerReducer);

    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const loginButton = await findByRole('button', { name: 'Login With Google' });
    act(() => { fireEvent.click(loginButton); });

    // assert
    waitFor(() => expect(window.open).toHaveBeenCalledWith('/login/google-oauth2/', '_self'));
  });
});

describe('logout button', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('appears when user is logged in', async () => {
    // arrange
    // THIS TEST SHOULD BE WORKING
    MockLoggedInStatus();
    const store = createStore(autoSchedulerReducer);

    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const logoutButton = await findByRole('button', { name: 'Logout' });

    // assert
    expect(logoutButton).toBeInTheDocument();
  });

  test('does not appear when user is logged out', async () => {
    // WORKING CORRECTLY BUT WRITTEN WRONG? .not.toBeInTheDocument works for login but not logout?
    // something is jank but haven't figured it out yet
    // arrange
    MockLoggedOutStatus();
    const store = createStore(autoSchedulerReducer);

    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const logoutButton = await findByRole('button', { name: 'Logout' });

    // assert
    expect(logoutButton).not.toBeInTheDocument();
  });

  test('Redirects to /sessions/logout when clicked', async () => {
    // DOESN'T WORK! ALWAYS PASSESS EVEN WHEN REPLACED WITH .not.toHaveBeenCalled
    // OR WRONG PARAMETERS
    // arrange
    MockLoggedInStatus();
    window.open = jest.fn();
    const store = createStore(autoSchedulerReducer);

    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const logoutButton = await findByRole('button', { name: 'Logout' });
    act(() => { fireEvent.click(logoutButton); });

    // assert
    waitFor(() => expect(window.open).toHaveBeenCalledWith('/sessions/logout', '_self'));
  });
});
