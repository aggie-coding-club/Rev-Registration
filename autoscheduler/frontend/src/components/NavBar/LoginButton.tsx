import * as React from 'react';
import * as Cookies from 'js-cookie';
import { Button, Typography } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import reloadPage from './reloadPage';
import * as styles from './NavBar.css';

// This file contains the login button. When a user logs in, it is replaced by their name
// followed by the logout button.
const LoginButton: React.FC = () => {
  // Used to track whether the API call has returned anything yet
  const [loading, setLoading] = React.useState(true);
  // default set to defaultTestUserName instead of empty string becuase I thought
  // an empty string might cause the refreshes on logout test to report false positives
  // very easily depending on future changes.
  const [usersName, setUsersName] = React.useState('defaultTestUserName');

  // used to logout the user
  function logout(): void {
    fetch('sessions/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
    }).then(
      (res) => {
        if (res.ok) {
          // reloads page to clear data locally after logout
          reloadPage();
          return;
        }

        throw new Error(String(res.status));
      },
    ).catch(() => { });
  }

  // This checks for the logged in user's name and sets it if found.
  // Otherwise, it throws an error and catches it so nothing breaks.
  React.useEffect(() => {
    fetch('sessions/get_full_name').then(
      (res) => {
        if (res.ok) {
          return res.json();
        }

        throw new Error(String(res.status));
      },
    ).then(({ fullName }) => {
      if (fullName) setUsersName(fullName);
    }).catch(() => { })
      .finally(() => { setLoading(false); });
  }, []);

  // Checks to make sure fetch call has finished before showing anything
  if (loading) {
    return null;
  }
  // Determines whether to show the login button  or the logout button
  // and user's name depending on whether a user is logged in or not
  return (
    usersName !== 'defaultTestUserName' ? (
      <div id={styles.NameAndButton}>
        <Typography variant="subtitle1">
          {usersName}
        </Typography>
        <Button
          color="inherit"
          aria-label="Logout"
          title="Logout"
          onClick={(): void => {
            logout();
          }}
        >
          <LogoutIcon />
        </Button>
      </div>
    ) : (
      <Button
        color="inherit"
        onClick={(): void => {
          window.open('/login/google-oauth2/', '_self');
        }}
      >
        Login With Google
      </Button>
    ));
};

export default LoginButton;
