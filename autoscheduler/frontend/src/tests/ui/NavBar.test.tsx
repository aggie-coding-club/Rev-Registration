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
import reloadPageFunctions from '../../components/NavBar/reloadPage';
import autoSchedulerReducer from '../../redux/reducer';

// Mocks window.open so it is possible to check if it is redirecting to the correct url
window.open = jest.fn();

// Mocks reload so it is possible to check if the page has reloaded
const reloadMock = jest.fn(() => console.log('reload was mocked'));
reloadPageFunctions.reloadPage = reloadMock;


// Mocks conditions for a logged in user. At the moment
// it's just a successful fetch call to sessions/get_full_name.
const mockLoggedInState = (): void => {
  fetchMock.mockResponseOnce(JSON.stringify({
    fullName: 'Bob Bobbins',
  }));
};

// Mocks conditions for a logged out user. At the moment it's
// just a failed (status:400) fetch call to sessions/get_full_name
const mockLoggedOutState = (): void => {
  fetchMock.mockResponseOnce('', {
    status: 400,
  });
};
/*
describe('login component', () => {
  // pretty useless beforeEach() because there's only one test in this
  // category but might as well leave it here in case of future updates
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('returns null when still loading', async () => {
    // arrange
    // not calling any API because calling one would set loading to done

    // prepare the search
    const store = createStore(autoSchedulerReducer);
    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );
    // act
    // find the component and check its value
    const buttonComponent = findByRole('button', { name: 'what a thing' });
    // assert
    expect(buttonComponent).toBeNull();
  });
});
*/
describe('login button', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  test('appears when user is logged out', async () => {
    // arrange
    mockLoggedOutState();

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
    mockLoggedInState();

    const store = createStore(autoSchedulerReducer);
    const { queryByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    const loginButton = await queryByRole('button', { name: 'Login With Google' });

    // assert
    expect(loginButton).not.toBeInTheDocument();
  });

  test('Redirects to /login/google-oauth2/ when clicked', async () => {
    // arrange
    mockLoggedOutState();

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
    mockLoggedInState();

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
    mockLoggedOutState();

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

  test('Refreshes page and clears user info when clicked', async () => {
    // arrange
    mockLoggedInState();
    mockLoggedInState(); // throwaway mock for logout fetch. could be anything w/out an error code
    mockLoggedOutState(); // used after refresh from the logout function. mimcs logout state
    // because the user has logged out after clicking the button
    const store = createStore(autoSchedulerReducer);
    const { findByRole } = render(
      <Provider store={store}>
        <NavBar />
      </Provider>,
    );

    // act
    // as of time of creation of this test, mocking window.location.reload is impossible.
    // Navigation is not supported by jsdom. Thus I am placing reload inside a function
    // called reloadPage in LoginButton.tsx that holds window.location.reload. If the
    // reloadPage was called, window.location.refresh is guranteed to have been called as well
    const logoutButton = await findByRole('button', { name: 'Logout' });
    act(() => { fireEvent.click(logoutButton); });

    // assert
    expect(reloadPageFunctions.reloadPage).toHaveBeenCalled();
  });
});
