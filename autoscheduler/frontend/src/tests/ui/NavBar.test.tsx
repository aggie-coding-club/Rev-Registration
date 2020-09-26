import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
// TODO ADD TEST FOR LOADING RETURN NULL
enableFetchMocks();
/* eslint-disable import/first */ // enableFetchMocks must be called before others are imported
import {
  render, fireEvent, act,
} from '@testing-library/react';
import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import NavBar from '../../components/NavBar/NavBar';
import autoSchedulerReducer from '../../redux/reducer';

// Mocks window.open so it is possible to check if it is redirecting to the correct url
window.open = jest.fn();

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

describe('login button', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('appears when user is logged out', async () => {
    // arrange
    mockFailedGetNameAPI();

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
    mockSuccessfulGetNameAPI();

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
    mockFailedGetNameAPI();

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
    expect(window.open).toHaveBeenCalledWith('/login/google-oauth2/', '_self');
  });
});

describe('logout button', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('appears when user is logged in', async () => {
    // arrange
    mockSuccessfulGetNameAPI();

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
    // arrange
    mockFailedGetNameAPI();

    const store = createStore(autoSchedulerReducer);
    // Used queryByRole because instead of findByRole like the rest because findByRole
    // returns an error when nothing is found and queryByRole does not
    const { queryByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const logoutButton = queryByRole('button', { name: 'Logout' });

    // assert
    expect(logoutButton).not.toBeInTheDocument();
  });

  test('Redirects to /sessions/logout when clicked', async () => {
    // arrange
    mockSuccessfulGetNameAPI();

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
    expect(window.open).toHaveBeenCalledWith('/sessions/logout', '_self');
  });
});
