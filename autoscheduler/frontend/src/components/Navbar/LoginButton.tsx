import * as React from 'react';
import * as Cookies from 'js-cookie';
import { Button, Typography } from '@material-ui/core';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import * as styles from './NavBar.css';

// This file contains the login button. When a user logs in, it is replaced by their name
// followed by the logout button.
const LoginButton: React.FC = () => {
  // Used to track whether the API call has returned anything yet
  const [loading, setLoading] = React.useState(true);
  const [usersName, setUsersName] = React.useState('');

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
          window.location.reload();
          return;
        } throw new Error(res.status.toString());
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

        throw new Error(res.status.toString());
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
    usersName ? (
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
